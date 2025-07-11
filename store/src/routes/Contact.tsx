import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({ name, email, message });

    setStatus("Thank you! Your message has been sent.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>

      <div className="mb-8 text-center text-gray-700">
        <p className="mb-2">📧 Email: support@myshop.com</p>
        <p className="mb-2">📞 Phone: +1 (555) 123-4567</p>
        <p>🏢 Address: 123 Example Street, New York, NY</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Your Name</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            value={message}
            required
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-2 rounded h-32"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded transition"
        >
          Send Message
        </button>

        {status && (
          <p className="text-green-600 mt-2 font-semibold">{status}</p>
        )}
      </form>
    </div>
  );
}
