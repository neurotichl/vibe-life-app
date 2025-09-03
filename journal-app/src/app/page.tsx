"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, BookOpen, Heart, Sparkles, Trash2, Edit3 } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';

interface JournalEntry {
  id: string;
  type: 'journal';
  content: string;
  metadata: {
    date: string;
    title?: string;
    mood?: string;
    tags: string[];
    source: string;
    created_at: string;
    updated_at: string;
  };
}

const moodEmojis = {
  amazing: '🌟',
  happy: '😊',
  okay: '😐',
  sad: '😔',
  angry: '😠',
  excited: '🎉',
  tired: '😴',
  grateful: '🙏',
};

const JournalApp = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState({
    content: '',
    title: '',
    mood: '',
    tags: '',
  });
  const [loading, setLoading] = useState(true);

  // Fetch entries for selected date
  useEffect(() => {
    fetchEntries();
  }, [selectedDate]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/journal?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!newEntry.content.trim()) return;

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newEntry.content,
          title: newEntry.title,
          mood: newEntry.mood,
          tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        const savedEntry = await response.json();
        setEntries(prev => [savedEntry, ...prev]);
        setNewEntry({ content: '', title: '', mood: '', tags: '' });
        setIsWriting(false);
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const deleteEntry = async (entry: JournalEntry) => {
    if (!confirm('确定要删除这条日记吗？')) return;

    try {
      const response = await fetch(`/api/journal?id=${entry.id}&date=${entry.metadata.date}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEntries(prev => prev.filter(e => e.id !== entry.id));
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'HH:mm');
  };

  const isDateToday = isToday(parseISO(selectedDate));

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <span>📖</span>
          我的日记本
          <span>✨</span>
        </h1>
        <p className="text-gray-600">记录每一天的美好时光</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Date Picker & New Entry */}
        <div className="lg:col-span-1 space-y-6">
          {/* Date Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              选择日期
            </h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            {isDateToday && (
              <div className="mt-3 text-center">
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  🌟 今天
                </span>
              </div>
            )}
          </div>

          {/* New Entry Button */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <button
              onClick={() => setIsWriting(!isWriting)}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {isWriting ? '取消写作' : '写新日记'}
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Writing Panel */}
          {isWriting && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                新的一页
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="今天的标题... 📝"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-gray-500"
                />

                <select
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, mood: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-700"
                >
                  <option value="" className="text-gray-500">选择今天的心情... 💫</option>
                  {Object.entries(moodEmojis).map(([mood, emoji]) => (
                    <option key={mood} value={mood}>
                      {emoji} {mood}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="标签 (用逗号分隔)... 🏷️"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-gray-500"
                />

                <textarea
                  placeholder="今天发生了什么美好的事情呢... ✨"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none placeholder:text-gray-500"
                />

                <button
                  onClick={saveEntry}
                  disabled={!newEntry.content.trim()}
                  className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  保存这一刻
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Entries List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {format(parseISO(selectedDate), 'M月d日')} 的记录
              {isDateToday && <span className="text-lg">🌟</span>}
            </h2>

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin text-4xl mb-4">⭐</div>
                <p className="text-gray-400">加载中...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-lg">这一天还没有记录呢</p>
                <p className="text-sm mt-2">点击左边的按钮开始写日记吧！</p>
              </div>
            ) : (
              <div className="space-y-6">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {entry.metadata.mood && (
                          <span className="text-2xl">
                            {moodEmojis[entry.metadata.mood as keyof typeof moodEmojis]}
                          </span>
                        )}
                        <div>
                          {entry.metadata.title && (
                            <h3 className="font-bold text-lg text-gray-800">
                              {entry.metadata.title}
                            </h3>
                          )}
                          <p className="text-sm text-gray-500">
                            {formatTime(entry.metadata.created_at)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteEntry(entry)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="prose prose-gray max-w-none mb-4">
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {entry.content}
                      </p>
                    </div>

                    {entry.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.metadata.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full"
                          >
                            🏷️ {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalApp;
