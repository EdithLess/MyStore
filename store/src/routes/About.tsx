function About() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">About Us</h1>
      
      <p className="text-lg mb-4">
        Welcome to <span className="font-semibold">MyShop</span> – your go-to online destination for modern and reliable tech products. We are passionate about delivering high-quality items at fair prices.
      </p>

      <p className="text-lg mb-4">
        Whether you're looking for the latest smartphones, powerful laptops, or stylish furniture, we've got you covered. Our catalog is always up-to-date, and we work hard to make your shopping experience smooth and pleasant.
      </p>

      <p className="text-lg mb-4">
        Our mission is simple: <span className="italic">offer great products with fast delivery and friendly support.</span> Thank you for trusting us!
      </p>

      <div className="mt-8 text-center">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/4086/4086679.png" 
          alt="Teamwork"
          className="mx-auto w-40 h-40 opacity-80"
        />
        <p className="text-sm mt-2 text-gray-500">Powered by people who care 💙</p>
      </div>
    </div>
  );
}

export default About;
