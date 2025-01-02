import { useState, useEffect } from 'react';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    discount: '',
    description: '',
    eligibility: '',
    organization: 'DemoOrg', // Replace with dynamic organization context
    addedBy: 'Admin123', // Replace with logged-in user context
  });
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/shop');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/shop', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingProduct
            ? { ...formData, productId: editingProduct }
            : formData
        ),
      });

      if (!response.ok) throw new Error('Failed to save product');
      await fetchProducts();
      setFormData({
        name: '',
        price: '',
        quantity: '',
        discount: '',
        description: '',
        eligibility: '',
        organization: 'DemoOrg',
        addedBy: 'Admin123',
      });
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch('/api/shop', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error('Failed to delete product');
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shop Management</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="p-2 border rounded mb-2 block w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
          className="p-2 border rounded mb-2 block w-full"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
          className="p-2 border rounded mb-2 block w-full"
        />
        <input
          type="number"
          placeholder="Discount (optional)"
          value={formData.discount}
          onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
          className="p-2 border rounded mb-2 block w-full"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="p-2 border rounded mb-2 block w-full"
        ></textarea>
        <input
          type="text"
          placeholder="Eligibility (e.g., Marketing, HR)"
          value={formData.eligibility}
          onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
          className="p-2 border rounded mb-2 block w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
      </form>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Discount</th>
            <th className="border border-gray-300 p-2">Eligibility</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-t">
              <td className="border border-gray-300 p-2">{product.name}</td>
              <td className="border border-gray-300 p-2">{product.price}</td>
              <td className="border border-gray-300 p-2">{product.quantity}</td>
              <td className="border border-gray-300 p-2">{product.discount || 0}%</td>
              <td className="border border-gray-300 p-2">{product.eligibility}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => {
                    setEditingProduct(product._id);
                    setFormData({
                      name: product.name,
                      price: product.price,
                      quantity: product.quantity,
                      discount: product.discount,
                      description: product.description,
                      eligibility: product.eligibility,
                      organization: product.organization,
                      addedBy: product.addedBy,
                    });
                  }}
                  className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}