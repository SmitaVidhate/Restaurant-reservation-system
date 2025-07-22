import React, { useState } from 'react';
import { Star, Clock, Leaf, Flame, Award } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  dietary: string[];
  spiceLevel?: number;
  isSignature?: boolean;
  prepTime: number;
  rating: number;
}

const menuItems: MenuItem[] = [
  // Appetizers
  {
    id: 1,
    name: "Truffle Arancini",
    description: "Crispy risotto balls filled with wild mushrooms and truffle oil, served with parmesan cream sauce",
    price: 18,
    category: "Appetizers",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    dietary: ["vegetarian"],
    prepTime: 15,
    rating: 4.8,
    isSignature: true
  },
  {
    id: 2,
    name: "Seared Scallops",
    description: "Pan-seared diver scallops with cauliflower purée, pancetta crisps, and micro greens",
    price: 24,
    category: "Appetizers",
    image: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400",
    dietary: ["gluten-free"],
    prepTime: 12,
    rating: 4.9
  },
  {
    id: 3,
    name: "Burrata Caprese",
    description: "Fresh burrata cheese with heirloom tomatoes, basil oil, and aged balsamic reduction",
    price: 16,
    category: "Appetizers",
    image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400",
    dietary: ["vegetarian", "gluten-free"],
    prepTime: 8,
    rating: 4.7
  },

  // Main Courses
  {
    id: 4,
    name: "Wagyu Beef Tenderloin",
    description: "8oz Australian wagyu with roasted bone marrow, seasonal vegetables, and red wine jus",
    price: 65,
    category: "Main Courses",
    image: "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400",
    dietary: ["gluten-free"],
    prepTime: 25,
    rating: 4.9,
    isSignature: true
  },
  {
    id: 5,
    name: "Lobster Thermidor",
    description: "Whole Maine lobster with cognac cream sauce, gruyère cheese, and herb-crusted potatoes",
    price: 58,
    category: "Main Courses",
    image: "https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=400",
    dietary: ["gluten-free"],
    prepTime: 30,
    rating: 4.8
  },
  {
    id: 6,
    name: "Duck Confit",
    description: "Slow-cooked duck leg with cherry gastrique, wild rice pilaf, and roasted root vegetables",
    price: 42,
    category: "Main Courses",
    image: "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=400",
    dietary: ["gluten-free"],
    prepTime: 35,
    rating: 4.6
  },
  {
    id: 7,
    name: "Seafood Risotto",
    description: "Arborio rice with fresh seafood medley, saffron, white wine, and parmesan",
    price: 38,
    category: "Main Courses",
    image: "https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=400",
    dietary: ["gluten-free"],
    prepTime: 28,
    rating: 4.7
  },

  // Desserts
  {
    id: 8,
    name: "Chocolate Soufflé",
    description: "Warm dark chocolate soufflé with vanilla bean ice cream and gold leaf",
    price: 14,
    category: "Desserts",
    image: "https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?auto=compress&cs=tinysrgb&w=400",
    dietary: ["vegetarian"],
    prepTime: 20,
    rating: 4.8,
    isSignature: true
  },
  {
    id: 9,
    name: "Tiramisu",
    description: "Classic Italian dessert with espresso-soaked ladyfingers, mascarpone, and cocoa",
    price: 12,
    category: "Desserts",
    image: "https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg?auto=compress&cs=tinysrgb&w=400",
    dietary: ["vegetarian"],
    prepTime: 5,
    rating: 4.6
  },
  {
    id: 10,
    name: "Crème Brûlée",
    description: "Vanilla bean custard with caramelized sugar crust and fresh berries",
    price: 13,
    category: "Desserts",
    image: "https://images.pexels.com/photos/1640779/pexels-photo-1640779.jpeg?auto=compress&cs=tinysrgb&w=400",
    dietary: ["vegetarian", "gluten-free"],
    prepTime: 8,
    rating: 4.7
  },

  // Beverages
  {
    id: 11,
    name: "Signature Cocktail",
    description: "House special with premium spirits, fresh herbs, and seasonal fruits",
    price: 16,
    category: "Beverages",
    image: "https://images.pexels.com/photos/1640780/pexels-photo-1640780.jpeg?auto=compress&cs=tinysrgb&w=400",
    dietary: [],
    prepTime: 5,
    rating: 4.5
  },
  {
    id: 12,
    name: "Wine Selection",
    description: "Curated selection of premium wines from our sommelier",
    price: 22,
    category: "Beverages",
    image: "https://images.pexels.com/photos/1640781/pexels-photo-1640781.jpeg?auto=compress&cs=tinysrgb&w=400",
    dietary: [],
    prepTime: 2,
    rating: 4.8
  }
];

const categories = ["All", "Appetizers", "Main Courses", "Desserts", "Beverages"];

const MenuView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const getDietaryIcon = (dietary: string) => {
    switch (dietary) {
      case 'vegetarian':
        return <Leaf className="h-4 w-4 text-green-600" />;
      case 'gluten-free':
        return <Award className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getSpiceLevel = (level?: number) => {
    if (!level) return null;
    return (
      <div className="flex items-center">
        {[...Array(3)].map((_, i) => (
          <Flame 
            key={i} 
            className={`h-3 w-3 ${i < level ? 'text-red-500' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience culinary excellence with our carefully crafted dishes, 
          made from the finest ingredients and prepared by our award-winning chefs.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              selectedCategory === category
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-700 shadow-md'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            onClick={() => setSelectedItem(item)}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              {item.isSignature && (
                <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Award className="h-3 w-3 inline mr-1" />
                  Signature
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <span className="text-2xl font-bold text-amber-600">${item.price}</span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

              {/* Details */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {item.prepTime} min
                </div>
                {getSpiceLevel(item.spiceLevel)}
              </div>

              {/* Dietary Info */}
              {item.dietary.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  {item.dietary.map(diet => (
                    <div key={diet} className="flex items-center gap-1 text-xs">
                      {getDietaryIcon(diet)}
                      <span className="capitalize">{diet.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              )}

              <button className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Menu Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-100 transition-all"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {selectedItem.isSignature && (
                <div className="absolute top-4 left-4 bg-amber-600 text-white px-4 py-2 rounded-full font-medium">
                  <Award className="h-4 w-4 inline mr-2" />
                  Signature Dish
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedItem.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {selectedItem.rating} rating
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedItem.prepTime} minutes
                    </div>
                  </div>
                </div>
                <span className="text-4xl font-bold text-amber-600">${selectedItem.price}</span>
              </div>

              <p className="text-gray-700 text-lg mb-6 leading-relaxed">{selectedItem.description}</p>

              {/* Dietary Information */}
              {selectedItem.dietary.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Dietary Information</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedItem.dietary.map(diet => (
                      <div key={diet} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                        {getDietaryIcon(diet)}
                        <span className="capitalize font-medium">{diet.replace('-', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spice Level */}
              {selectedItem.spiceLevel && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Spice Level</h3>
                  <div className="flex items-center gap-2">
                    {getSpiceLevel(selectedItem.spiceLevel)}
                    <span className="text-sm text-gray-600 ml-2">
                      {selectedItem.spiceLevel === 1 && 'Mild'}
                      {selectedItem.spiceLevel === 2 && 'Medium'}
                      {selectedItem.spiceLevel === 3 && 'Hot'}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
                <button className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium">
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chef's Special Section */}
      <div className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Chef's Special</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our head chef creates unique seasonal dishes using the finest local ingredients. 
            Ask your server about today's special creations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Award Winning</h3>
            <p className="text-gray-600 text-sm">Recognized by Michelin Guide and James Beard Foundation</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fresh Ingredients</h3>
            <p className="text-gray-600 text-sm">Sourced daily from local farms and sustainable suppliers</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">5-Star Experience</h3>
            <p className="text-gray-600 text-sm">Exceptional service and unforgettable dining experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuView;