import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/admin.css';

// ICON CONFIGURATION - Change these URLs to update icons
const ADMIN_ICONS = {
  recipes: "https://cdn-icons-png.flaticon.com/128/3389/3389081.png",
  reviews: "https://cdn-icons-png.flaticon.com/128/1828/1828884.png", 
  users: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
  favorites: "https://cdn-icons-png.flaticon.com/128/833/833472.png",
  noReviews: "https://cdn-icons-png.flaticon.com/128/2593/2593491.png",
  analytics: "https://cdn-icons-png.flaticon.com/128/2920/2920277.png"
};

// Interfaces
interface Recipe {
  _id: string;
  title: string;
  category: string;
  createdAt: string;
  rating?: number;
  favorites?: number;
  status?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  role?: string;
}

interface Review {
  _id: string;
  recipeId: string;
  recipeName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status?: string;
}

// Avatar Component Helper
const Avatar: React.FC<{ name: string; size?: 'sm' | 'md' | 'lg' }> = ({ name, size = 'md' }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClass = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size];

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold`}
    >
      {initials}
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'recent' | 'all'>('recent');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const [recipesRes, usersRes, reviewsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/recipes', { headers }),
          axios.get('http://localhost:5000/api/admin/users', { headers }),
          axios.get('http://localhost:5000/api/admin/reviews', { headers }),
        ]);

        setRecipes(recipesRes.data || []);
        setUsers(usersRes.data || []);
        setReviews(reviewsRes.data || []);
        console.log('📊 Admin Dashboard - Loaded data:', {
          recipes: recipesRes.data?.length || 0,
          users: usersRes.data?.length || 0,
          reviews: reviewsRes.data?.length || 0
        });
        if (reviewsRes.data?.length > 0) {
          console.log('📝 Latest reviews:', reviewsRes.data.slice(0, 3));
        }
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRecipes = recipes;
  const filteredUsers = users;
  const filteredReviews = reviews;

  // Search recipes
  const searchedRecipes = filteredRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get recipes for table
  const displayedRecipes = activeTab === 'recent' ? searchedRecipes.slice(0, 5) : searchedRecipes;

  // Calculate stats
  const totalRecipes = filteredRecipes.length;
  const pendingReviews = filteredReviews.length;
  const totalUsers = filteredUsers.length;
  const totalFavorites = filteredRecipes.reduce((sum: number, r: Recipe) => sum + (r.favorites || 0), 0);

  // Get category breakdown
  const categoryBreakdown: Record<string, number> = filteredRecipes.reduce(
    (acc, recipe) => {
      const category = recipe.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Get recipe trends (by date)
  const recipeTrends = filteredRecipes.reduce(
    (acc, recipe) => {
      const date = new Date(recipe.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const trendData: [string, number][] = Object.entries(recipeTrends)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .slice(-7) as [string, number][];

  // Get latest reviews
  const latestReviews: Review[] = filteredReviews.slice(0, 10); // Show more reviews

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar activePage="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePage="dashboard" />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your platform overview.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Recipes */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Recipes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalRecipes}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <img src={ADMIN_ICONS.recipes} alt="Recipes" className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Reviews</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{pendingReviews}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <img src={ADMIN_ICONS.reviews} alt="Reviews" className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Total Users */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <img src={ADMIN_ICONS.users} alt="Users" className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Total Favorites */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Favorites</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalFavorites}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <img src={ADMIN_ICONS.favorites} alt="Favorites" className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recipe Trends Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Overview</h2>
              {filteredRecipes.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-500">
                  <p>No data available</p>
                </div>
              ) : (
                <>
                  <div className="flex items-end gap-2 h-48">
                    {trendData.map(([date, count]: [string, number]) => {
                      const maxCount = Math.max(...trendData.map(([, c]: [string, number]) => c), 1);
                      const height = (count / maxCount) * 100;
                      return (
                        <div
                          key={date}
                          className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition cursor-pointer group relative"
                          style={{ height: `${height}%` }}
                          title={`${date}: ${count} recipes`}
                        >
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                            {count} recipes
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    {trendData.length > 0 && (
                      <>
                        <span>{trendData[0][0]}</span>
                        <span>{trendData[trendData.length - 1][0]}</span>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Recipes by Category */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recipes by Category</h2>
              {Object.entries(categoryBreakdown).length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-500">
                  <p>No data available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(Object.entries(categoryBreakdown) as [string, number][])
                    .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
                    .slice(0, 6)
                    .map(([category, count]: [string, number]) => {
                      const total = Object.values(categoryBreakdown).reduce((a: number, b: number) => a + b, 0);
                      const percentage = ((count / total) * 100).toFixed(1);
                      return (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 font-medium">{category}</span>
                            <span className="text-gray-600">{count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Recipes Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recipes</h2>
              <button
                onClick={() => navigate('/admin/recipes')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View All Recipes
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-4 py-2 font-medium transition ${
                  activeTab === 'recent'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Recent (5)
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 font-medium transition ${
                  activeTab === 'all'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({searchedRecipes.length})
              </button>
            </div>

            {/* Recipe Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Favorites</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRecipes.length > 0 ? (
                    displayedRecipes.map((recipe) => (
                      <tr key={recipe._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{recipe.title}</td>
                        <td className="py-3 px-4 text-gray-600">{recipe.category}</td>
                        <td className="py-3 px-4">
                          <span className="text-yellow-500">★</span> {recipe.rating || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{recipe.favorites || 0}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(recipe.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No recipes found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Latest Reviews Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Latest Reviews ({latestReviews.length})</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {latestReviews.length > 0 ? (
                  latestReviews.map((review) => (
                    <div key={review._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <Avatar name={review.userName} size="sm" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900">{review.userName}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()} at {new Date(review.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-blue-600 font-medium mb-2">Recipe: {review.recipeName}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`text-sm ${star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">{review.rating}/5</span>
                          </div>
                          <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                            <p className="text-sm text-gray-800 italic">"{review.comment}"</p>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Recipe ID: {review.recipeId}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              User: {review.userName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">
                      <img src="https://cdn-icons-png.flaticon.com/128/2593/2593491.png" alt="No Reviews" className="w-16 h-16 mx-auto" />
                    </div>
                    <p className="text-gray-500">No reviews available</p>
                    <p className="text-sm text-gray-400 mt-1">Reviews will appear here when users comment on recipes</p>
                  </div>
                )}
              </div>
                {latestReviews.length > 10 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/admin/reviews')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    View All {filteredReviews.length} Reviews
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/recipes')}
                  className="w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-left font-medium flex items-center gap-3"
                >
                  <img src={ADMIN_ICONS.recipes} alt="Recipes" className="w-6 h-6" />
                  Manage Recipes
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-left font-medium flex items-center gap-3"
                >
                  <img src={ADMIN_ICONS.users} alt="Users" className="w-6 h-6" />
                  Manage Users
                </button>
                <button
                  onClick={() => navigate('/admin/reviews')}
                  className="w-full px-4 py-3 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition text-left font-medium flex items-center gap-3"
                >
                  <img src={ADMIN_ICONS.reviews} alt="Reviews" className="w-6 h-6" />
                  Manage Reviews
                </button>
                <button
                  onClick={() => navigate('/admin/analytics')}
                  className="w-full px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition text-left font-medium flex items-center gap-3"
                >
                  <img src={ADMIN_ICONS.analytics} alt="Analytics" className="w-6 h-6" />
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
