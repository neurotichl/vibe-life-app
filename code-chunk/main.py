import ast
import hashlib
import json
import os
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Dict, List, Optional


@dataclass
class CodeChunk:
    id: str
    type: str  # 'function', 'class', 'module', 'context', 'structure'
    content: str
    metadata: Dict
    embedding: Optional[List[float]] = None


class CodeIndexer:
    def __init__(self, repo_paths: List[str]):
        self.repo_paths = repo_paths
        self.chunks: List[CodeChunk] = []
        self.file_extensions = {
            ".py",
            ".js",
            ".ts",
            ".java",
            ".cpp",
            ".h",
            ".go",
            ".rs",
        }

        # Directories to skip
        self.skip_dirs = {
            ".git",
            ".venv",
            "venv",
            "env",
            ".env",
            "node_modules",
            "__pycache__",
            ".pytest_cache",
            "dist",
            "build",
            ".next",
            ".nuxt",
            "target",  # Rust
            "bin",
            "obj",  # C#/.NET
            ".idea",
            ".vscode",  # IDEs
        }

    def index_repositories(self) -> List[CodeChunk]:
        """Main indexing function"""
        for repo_path in self.repo_paths:
            print(f"Indexing repository: {repo_path}")
            self._index_repository(repo_path)

        return self.chunks

    def _index_repository(self, repo_path: str):
        """Index a single repository"""
        repo_name = Path(repo_path).name

        # 1. Create repository overview
        self._create_repo_overview(repo_path, repo_name)

        # 2. Index individual files
        for file_path in self._get_code_files(repo_path):
            self._index_file(file_path, repo_name)

        # 3. Create contextual chunks (related files)
        self._create_context_chunks(repo_path, repo_name)

    def _get_code_files(self, repo_path: str) -> List[str]:
        """Get all code files from repository"""
        code_files = []
        for root, dirs, files in os.walk(repo_path):
            # Skip directories - modify dirs in-place to prevent os.walk from entering them
            dirs[:] = [
                d for d in dirs if d not in self.skip_dirs and not d.startswith(".")
            ]

            for file in files:
                if Path(file).suffix in self.file_extensions:
                    code_files.append(os.path.join(root, file))

        return code_files

    def _index_file(self, file_path: str, repo_name: str):
        """Index a single file - create multiple chunk types"""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
        except UnicodeDecodeError:
            print(f"Skipping binary file: {file_path}")
            return

        rel_path = os.path.relpath(file_path, self.repo_paths[0])

        # File-level chunk (imports, module docstring, overall structure)
        self._create_file_overview_chunk(content, file_path, repo_name, rel_path)

        # Parse AST for Python files (extend for other languages)
        if file_path.endswith(".py"):
            self._index_python_file(content, file_path, repo_name, rel_path)
        else:
            # For non-Python files, create simpler chunks
            self._index_generic_file(content, file_path, repo_name, rel_path)

    def _create_file_overview_chunk(
        self, content: str, file_path: str, repo_name: str, rel_path: str
    ):
        """Create overview chunk for the entire file"""
        # Extract imports and module-level info
        lines = content.split("\n")
        imports = [
            line for line in lines[:50] if line.strip().startswith(("import ", "from "))
        ]

        # Get first few lines of docstring/comments
        overview_lines = []
        for line in lines[:20]:
            if line.strip().startswith("#") or '"""' in line or "'''" in line:
                overview_lines.append(line)

        overview_content = "\n".join(imports + overview_lines)

        chunk_id = self._generate_chunk_id(f"{repo_name}_{rel_path}_overview")

        chunk = CodeChunk(
            id=chunk_id,
            type="file_overview",
            content=overview_content,
            metadata={
                "repo_name": repo_name,
                "file_path": rel_path,
                "full_path": file_path,
                "file_size": len(content),
                "imports": imports,
                "file_type": Path(file_path).suffix,
            },
        )
        self.chunks.append(chunk)

    def _index_python_file(
        self, content: str, file_path: str, repo_name: str, rel_path: str
    ):
        """Index Python file using AST parsing"""
        try:
            tree = ast.parse(content)
        except SyntaxError:
            print(f"Syntax error in {file_path}, skipping AST parsing")
            return

        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                self._create_function_chunk(
                    node, content, file_path, repo_name, rel_path
                )
            elif isinstance(node, ast.ClassDef):
                self._create_class_chunk(node, content, file_path, repo_name, rel_path)

    def _create_function_chunk(
        self,
        node: ast.FunctionDef,
        file_content: str,
        file_path: str,
        repo_name: str,
        rel_path: str,
    ):
        """Create chunk for individual function"""
        lines = file_content.split("\n")
        start_line = node.lineno - 1
        end_line = node.end_lineno if hasattr(node, "end_lineno") else start_line + 20

        function_content = "\n".join(lines[start_line:end_line])

        # Extract function calls and dependencies
        function_calls = []
        for child in ast.walk(node):
            if isinstance(child, ast.Call) and isinstance(child.func, ast.Name):
                function_calls.append(child.func.id)

        chunk_id = self._generate_chunk_id(f"{repo_name}_{rel_path}_{node.name}")

        chunk = CodeChunk(
            id=chunk_id,
            type="function",
            content=function_content,
            metadata={
                "repo_name": repo_name,
                "file_path": rel_path,
                "function_name": node.name,
                "line_range": [start_line + 1, end_line],
                "args": [arg.arg for arg in node.args.args],
                "calls": list(set(function_calls)),
                "decorators": [
                    d.id if isinstance(d, ast.Name) else str(d)
                    for d in node.decorator_list
                ],
            },
        )
        self.chunks.append(chunk)

    def _create_class_chunk(
        self,
        node: ast.ClassDef,
        file_content: str,
        file_path: str,
        repo_name: str,
        rel_path: str,
    ):
        """Create chunk for entire class"""
        lines = file_content.split("\n")
        start_line = node.lineno - 1
        end_line = node.end_lineno if hasattr(node, "end_lineno") else len(lines)

        class_content = "\n".join(lines[start_line:end_line])

        # Extract method names
        methods = [n.name for n in node.body if isinstance(n, ast.FunctionDef)]

        chunk_id = self._generate_chunk_id(f"{repo_name}_{rel_path}_class_{node.name}")

        chunk = CodeChunk(
            id=chunk_id,
            type="class",
            content=class_content,
            metadata={
                "repo_name": repo_name,
                "file_path": rel_path,
                "class_name": node.name,
                "line_range": [start_line + 1, end_line],
                "methods": methods,
                "base_classes": [
                    base.id if isinstance(base, ast.Name) else str(base)
                    for base in node.bases
                ],
            },
        )
        self.chunks.append(chunk)

    def _create_context_chunks(self, repo_path: str, repo_name: str):
        """Create chunks that group related files together"""
        # Group files by directory
        file_groups = {}
        for chunk in self.chunks:
            # Only process chunks that have file_path and belong to this repo
            if (
                chunk.metadata.get("repo_name") == repo_name
                and "file_path" in chunk.metadata
                and chunk.type not in ["repository_overview"]
            ):  # Skip repo overview chunks
                dir_path = os.path.dirname(chunk.metadata["file_path"])
                if dir_path not in file_groups:
                    file_groups[dir_path] = []
                file_groups[dir_path].append(chunk)

        # Create context chunks for each directory
        for dir_path, chunks in file_groups.items():
            if len(chunks) > 1:  # Only create context if multiple files
                self._create_directory_context_chunk(dir_path, chunks, repo_name)

    def _create_directory_context_chunk(
        self, dir_path: str, chunks: List[CodeChunk], repo_name: str
    ):
        """Create a context chunk for related files in a directory"""
        file_summaries = []
        all_files = set()

        for chunk in chunks:
            if chunk.type in ["function", "class"]:
                summary = f"{chunk.metadata['file_path']}: {chunk.type} {chunk.metadata.get(f'{chunk.type}_name', '')}"
                file_summaries.append(summary)
                all_files.add(chunk.metadata["file_path"])

        context_content = f"Directory: {dir_path}\n"
        context_content += f"Files: {', '.join(all_files)}\n"
        context_content += "Components:\n" + "\n".join(file_summaries)

        chunk_id = self._generate_chunk_id(f"{repo_name}_{dir_path}_context")

        chunk = CodeChunk(
            id=chunk_id,
            type="directory_context",
            content=context_content,
            metadata={
                "repo_name": repo_name,
                "directory": dir_path,
                "files": list(all_files),
                "component_count": len(file_summaries),
            },
        )
        self.chunks.append(chunk)

    def _create_repo_overview(self, repo_path: str, repo_name: str):
        """Create high-level repository overview"""
        # Analyze directory structure
        structure_info = self._analyze_repo_structure(repo_path)

        chunk_id = self._generate_chunk_id(f"{repo_name}_overview")

        chunk = CodeChunk(
            id=chunk_id,
            type="repository_overview",
            content=structure_info,
            metadata={
                "repo_name": repo_name,
                "repo_path": repo_path,
                "type": "overview",
            },
        )
        self.chunks.append(chunk)

    def _analyze_repo_structure(self, repo_path: str) -> str:
        """Analyze and describe repository structure"""
        structure = []
        for root, dirs, files in os.walk(repo_path):
            # Skip directories using the centralized skip list
            dirs[:] = [
                d for d in dirs if d not in self.skip_dirs and not d.startswith(".")
            ]

            level = root.replace(repo_path, "").count(os.sep)
            indent = "  " * level
            structure.append(f"{indent}{os.path.basename(root)}/")

            # Add important files
            code_files = [f for f in files if Path(f).suffix in self.file_extensions]
            if code_files:
                for file in sorted(code_files)[:5]:  # Show first 5 files
                    structure.append(f"{indent}  {file}")

        return "\n".join(structure[:50])  # Limit size

    def _index_generic_file(
        self, content: str, file_path: str, repo_name: str, rel_path: str
    ):
        """Index non-Python files with simpler approach"""
        # For now, create chunks based on logical sections
        # You can extend this for specific languages

        chunk_id = self._generate_chunk_id(f"{repo_name}_{rel_path}_content")

        chunk = CodeChunk(
            id=chunk_id,
            type="file_content",
            content=content[:2000],  # Limit content size
            metadata={
                "repo_name": repo_name,
                "file_path": rel_path,
                "file_type": Path(file_path).suffix,
                "full_content_length": len(content),
            },
        )
        self.chunks.append(chunk)

    def _generate_chunk_id(self, base_id: str) -> str:
        """Generate unique chunk ID"""
        return hashlib.md5(base_id.encode()).hexdigest()[:12]

    def save_chunks(self, output_path: str):
        """Save chunks to JSON file"""
        chunks_data = [asdict(chunk) for chunk in self.chunks]
        with open(output_path, "w") as f:
            json.dump(chunks_data, f, indent=2)

    def load_chunks(self, input_path: str):
        """Load chunks from JSON file"""
        with open(input_path, "r") as f:
            chunks_data = json.load(f)

        self.chunks = [CodeChunk(**chunk_data) for chunk_data in chunks_data]


# Usage example
if __name__ == "__main__":
    # Initialize indexer with your repo paths
    indexer = CodeIndexer(
        [
            "/Users/chiauhung/Documents/Projects/llm-orchestrator",
            "/Users/chiauhung/Documents/Projects/de-integration-cf",
        ]
    )

    # Index all repositories
    chunks = indexer.index_repositories()

    # Save to file
    indexer.save_chunks("code_chunks.json")

    print(f"Created {len(chunks)} chunks")
    print("Chunk types:", {chunk.type for chunk in chunks})
