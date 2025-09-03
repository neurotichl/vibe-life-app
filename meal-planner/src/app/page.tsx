"use client";

import React, { useState } from 'react';
import { RefreshCw, ShoppingCart, Sparkles } from 'lucide-react';

const WeeklyMealPlanner = () => {
  // 食谱数据
  const recipes = {
    breakfast: [
      {
        id: 'b1',
        name: '番茄炒蛋',
        ingredients: [
          { name: '鸡蛋', emoji: '🥚', amount: '3个', category: '蛋类' },
          { name: '番茄', emoji: '🍅', amount: '2个', category: '蔬菜' }
        ]
      },
      {
        id: 'b2',
        name: '牛奶燕麦',
        ingredients: [
          { name: '燕麦', emoji: '🌾', amount: '50g', category: '谷物' },
          { name: '牛奶', emoji: '🥛', amount: '200ml', category: '乳制品' },
          { name: '香蕉', emoji: '🍌', amount: '1根', category: '水果' }
        ]
      },
      {
        id: 'b3',
        name: '三明治',
        ingredients: [
          { name: '面包', emoji: '🍞', amount: '2片', category: '谷物' },
          { name: '火腿', emoji: '🥓', amount: '2片', category: '肉类' },
          { name: '生菜', emoji: '🥬', amount: '2片', category: '蔬菜' }
        ]
      },
      {
        id: 'b4',
        name: '小笼包',
        ingredients: [
          { name: '小笼包', emoji: '🥟', amount: '6个', category: '面食' },
          { name: '豆浆', emoji: '🥛', amount: '1杯', category: '饮品' }
        ]
      }
    ],
    lunch: [
      {
        id: 'l1',
        name: '宫保鸡丁',
        ingredients: [
          { name: '鸡肉', emoji: '🐔', amount: '200g', category: '肉类' },
          { name: '花生', emoji: '🥜', amount: '50g', category: '坚果' },
          { name: '青椒', emoji: '🫑', amount: '1个', category: '蔬菜' },
          { name: '米饭', emoji: '🍚', amount: '1碗', category: '谷物' }
        ]
      },
      {
        id: 'l2',
        name: '红烧肉',
        ingredients: [
          { name: '猪肉', emoji: '🥩', amount: '300g', category: '肉类' },
          { name: '土豆', emoji: '🥔', amount: '2个', category: '蔬菜' },
          { name: '米饭', emoji: '🍚', amount: '1碗', category: '谷物' }
        ]
      },
      {
        id: 'l3',
        name: '清蒸鱼',
        ingredients: [
          { name: '鲈鱼', emoji: '🐟', amount: '1条', category: '海鲜' },
          { name: '葱', emoji: '🧅', amount: '2根', category: '蔬菜' },
          { name: '姜', emoji: '🫚', amount: '少许', category: '调料' },
          { name: '米饭', emoji: '🍚', amount: '1碗', category: '谷物' }
        ]
      },
      {
        id: 'l4',
        name: '意大利面',
        ingredients: [
          { name: '意面', emoji: '🍝', amount: '100g', category: '面食' },
          { name: '番茄酱', emoji: '🍅', amount: '3汤匙', category: '调料' },
          { name: '芝士', emoji: '🧀', amount: '30g', category: '乳制品' }
        ]
      }
    ],
    dinner: [
      {
        id: 'd1',
        name: '白菜炖豆腐',
        ingredients: [
          { name: '白菜', emoji: '🥬', amount: '200g', category: '蔬菜' },
          { name: '豆腐', emoji: '🧈', amount: '1块', category: '豆制品' },
          { name: '米饭', emoji: '🍚', amount: '1碗', category: '谷物' }
        ]
      },
      {
        id: 'd2',
        name: '虾仁炒饭',
        ingredients: [
          { name: '虾仁', emoji: '🦐', amount: '150g', category: '海鲜' },
          { name: '米饭', emoji: '🍚', amount: '1碗', category: '谷物' },
          { name: '鸡蛋', emoji: '🥚', amount: '2个', category: '蛋类' },
          { name: '青豆', emoji: '🟢', amount: '50g', category: '蔬菜' }
        ]
      },
      {
        id: 'd3',
        name: '蒸蛋羹',
        ingredients: [
          { name: '鸡蛋', emoji: '🥚', amount: '3个', category: '蛋类' },
          { name: '虾仁', emoji: '🦐', amount: '100g', category: '海鲜' },
          { name: '香葱', emoji: '🧅', amount: '1根', category: '蔬菜' }
        ]
      },
      {
        id: 'd4',
        name: '青菜汤面',
        ingredients: [
          { name: '面条', emoji: '🍜', amount: '100g', category: '面食' },
          { name: '青菜', emoji: '🥬', amount: '100g', category: '蔬菜' },
          { name: '鸡蛋', emoji: '🥚', amount: '1个', category: '蛋类' }
        ]
      }
    ]
  };

  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const mealTypes = [
    { key: 'breakfast', name: '早餐', emoji: '🌅' },
    { key: 'lunch', name: '午餐', emoji: '☀️' },
    { key: 'dinner', name: '晚餐', emoji: '🌙' }
  ];

  const [weeklyPlan, setWeeklyPlan] = useState({});

  // 随机选择食谱
  const getRandomRecipe = (mealType) => {
    const mealRecipes = recipes[mealType];
    return mealRecipes[Math.floor(Math.random() * mealRecipes.length)];
  };

  // 生成整周计划
  const generateWeeklyPlan = () => {
    const newPlan = {};
    days.forEach(day => {
      newPlan[day] = {};
      mealTypes.forEach(meal => {
        newPlan[day][meal.key] = getRandomRecipe(meal.key);
      });
    });
    setWeeklyPlan(newPlan);
  };

  // 重新生成单个餐点
  const regenerateMeal = (day, mealType) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: getRandomRecipe(mealType)
      }
    }));
  };

  // 生成购物清单
  const generateShoppingList = () => {
    const ingredientMap = new Map();

    Object.values(weeklyPlan).forEach(dayPlan => {
      Object.values(dayPlan).forEach(meal => {
        meal.ingredients.forEach(ingredient => {
          const key = ingredient.name;
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key);
            existing.count += 1;
          } else {
            ingredientMap.set(key, {
              ...ingredient,
              count: 1
            });
          }
        });
      });
    });

    const grouped = {};
    ingredientMap.forEach(ingredient => {
      const category = ingredient.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(ingredient);
    });

    return grouped;
  };

  const shoppingList = generateShoppingList();

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-orange-50 to-pink-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <span>🍽️</span>
          每周食谱生成器
          <span>✨</span>
        </h1>
        <p className="text-gray-600">轻松规划你的一周三餐</p>
      </div>

      {/* 生成按钮 */}
      <div className="text-center mb-8">
        <button
          onClick={generateWeeklyPlan}
          className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
        >
          <Sparkles className="w-5 h-5" />
          生成本周菜单
          <Sparkles className="w-5 h-5" />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 周计划表 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              📅 本周菜单
            </h2>

            {Object.keys(weeklyPlan).length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-6xl mb-4">🍳</div>
                <p className="text-lg">点击上方按钮生成你的专属菜单吧！</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="grid grid-cols-1 gap-4">
                  {days.map(day => (
                    <div key={day} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h3 className="font-bold text-lg text-gray-800 mb-3">{day}</h3>
                      <div className="grid md:grid-cols-3 gap-3">
                        {mealTypes.map(meal => (
                          <div key={meal.key} className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-sm text-gray-600 flex items-center gap-1">
                                {meal.emoji} {meal.name}
                              </span>
                              <button
                                onClick={() => regenerateMeal(day, meal.key)}
                                className="text-gray-400 hover:text-orange-500 transition-colors"
                                title="重新生成"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            </div>
                            {weeklyPlan[day] && weeklyPlan[day][meal.key] && (
                              <div>
                                <div className="font-medium text-gray-800 mb-2">
                                  {weeklyPlan[day][meal.key].name}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {weeklyPlan[day][meal.key].ingredients.map((ingredient, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                                    >
                                      {ingredient.emoji} {ingredient.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 购物清单 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              购物清单
            </h2>

            {Object.keys(shoppingList).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🛒</div>
                <p>生成菜单后会自动显示购物清单</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(shoppingList).map(([category, ingredients]) => (
                  <div key={category} className="border-l-4 border-orange-300 pl-4">
                    <h3 className="font-semibold text-gray-700 mb-2">{category}</h3>
                    <div className="space-y-1">
                      {ingredients.map((ingredient, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            {ingredient.emoji} {ingredient.name}
                          </span>
                          {ingredient.count > 1 && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              x{ingredient.count}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
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

export default WeeklyMealPlanner;