import { Phone, Mail, MapPin, CheckCircle, Star, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, GalleryImage } from './lib/supabase';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    suburb: '',
    email: '',
    projectType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_enquiries')
        .insert([{
          name: formData.name,
          phone: formData.phone,
          suburb: formData.suburb,
          email: formData.email || null,
          project_type: formData.projectType,
          message: formData.message || '',
          status: 'new'
        }]);

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      // Send email via edge function
      const emailResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!emailResponse.ok) {
        console.error('Email error:', await emailResponse.text());
      }

      // Show success message
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        suburb: '',
        email: '',
        projectType: '',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your enquiry. Please try calling us directly.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Gallery images fetched:', data);
        setGalleryImages(data || []);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 w-full bg-[#2E2E2E] text-white z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-32">
            <div className="flex items-center">
              <img src="/My-Home-png.png" alt="My Home Constructions Logo" className="h-28 w-auto" />
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="hover:text-[#F5B400] transition">Services</a>
              <a href="#gallery" className="hover:text-[#F5B400] transition">Gallery</a>
              <a href="#testimonials" className="hover:text-[#F5B400] transition">Reviews</a>
              <a href="#contact" className="hover:text-[#F5B400] transition">Contact</a>
            </div>
            <a href="tel:0412345678" className="bg-[#F5B400] text-[#2E2E2E] px-4 py-2 rounded-lg font-semibold hover:bg-[#e5a500] transition flex items-center gap-2">
              <Phone size={18} />
              <span className="hidden sm:inline">Call Now</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 mt-16">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 bg-[url('/pexels-sliceisop-24827287.jpg')] bg-cover bg-center"></div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Pergolas, Decking & Weatherboard Homes — <span className="text-[#3C3C3C] bg-white px-4 py-2 rounded-lg shadow-2xl inline-block transform hover:scale-105 transition-transform">Built</span> for Melbourne Living
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-light tracking-wide leading-relaxed">
            <span className="bg-white/90 text-[#2E2E2E] px-6 py-3 rounded inline-block">
              Enhancing homes with <span className="font-semibold">design-driven craftsmanship</span> and lasting quality
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="bg-[#F5B400] text-[#2E2E2E] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#e5a500] transition transform hover:scale-105 shadow-xl">
              Get My Free Quote
            </a>
            <a href="tel:0412345678" className="bg-white text-[#2E2E2E] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-xl">
              Call Now — Fast On-Site Quotes
            </a>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-4">Our Specialties</h3>
            <p className="text-xl text-gray-600">Premium outdoor and exterior transformations</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#F5B400] rounded-lg flex items-center justify-center mb-6">
                <div className="text-3xl font-bold text-[#2E2E2E]">P</div>
              </div>
              <h4 className="text-2xl font-bold text-[#2E2E2E] mb-4">Pergolas</h4>
              <p className="text-gray-600 leading-relaxed">
                Custom timber, Colorbond, and modern aluminum builds designed to create the perfect outdoor entertaining space.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#F5B400] rounded-lg flex items-center justify-center mb-6">
                <div className="text-3xl font-bold text-[#2E2E2E]">D</div>
              </div>
              <h4 className="text-2xl font-bold text-[#2E2E2E] mb-4">Decking</h4>
              <p className="text-gray-600 leading-relaxed">
                Merbau, composite, and entertaining area decking that transforms your outdoor living experience.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#F5B400] rounded-lg flex items-center justify-center mb-6">
                <div className="text-3xl font-bold text-[#2E2E2E]">W</div>
              </div>
              <h4 className="text-2xl font-bold text-[#2E2E2E] mb-4">Weatherboard Homes</h4>
              <p className="text-gray-600 leading-relaxed">
                Restorations, renovations, and new builds that honor Melbourne's classic architectural style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-4">Why Choose Us</h3>
            <p className="text-xl text-gray-600">Melbourne's trusted building partner</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F5B400] rounded-full mb-4">
                <CheckCircle size={40} className="text-[#2E2E2E]" />
              </div>
              <h4 className="text-xl font-bold text-[#2E2E2E] mb-2">10+ Years Experience</h4>
              <p className="text-gray-600">Proven expertise in quality construction</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F5B400] rounded-full mb-4">
                <CheckCircle size={40} className="text-[#2E2E2E]" />
              </div>
              <h4 className="text-xl font-bold text-[#2E2E2E] mb-2">Fully Licensed & Insured</h4>
              <p className="text-gray-600">Complete peace of mind guaranteed</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F5B400] rounded-full mb-4">
                <CheckCircle size={40} className="text-[#2E2E2E]" />
              </div>
              <h4 className="text-xl font-bold text-[#2E2E2E] mb-2">Tailored Designs</h4>
              <p className="text-gray-600">Custom solutions for your unique home</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F5B400] rounded-full mb-4">
                <CheckCircle size={40} className="text-[#2E2E2E]" />
              </div>
              <h4 className="text-xl font-bold text-[#2E2E2E] mb-2">Local Melbourne Builder</h4>
              <p className="text-gray-600">Serving metro and surrounding suburbs</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <div className="inline-block bg-[#F5B400] text-[#2E2E2E] px-8 py-4 rounded-lg font-bold text-2xl">
              450+ Projects Completed
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-4">Our Work</h3>
            <p className="text-xl text-gray-600">Quality craftsmanship in every project</p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5B400]"></div>
              <p className="mt-4 text-gray-600">Loading gallery...</p>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No images found in gallery. Check console for errors.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image) => (
                  <div key={image.id} className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer">
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-80 object-cover transform group-hover:scale-110 transition duration-500"
                      onError={(e) => {
                        console.error('Image failed to load:', image.image_url);
                        e.currentTarget.src = '/image.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition flex items-center justify-center">
                      <div className="text-center opacity-0 group-hover:opacity-100 transition px-4">
                        <span className="text-white font-bold text-lg block mb-2">{image.title}</span>
                        {image.description && (
                          <span className="text-white text-sm">{image.description}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <button className="bg-[#2E2E2E] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#3E3E3E] transition inline-flex items-center gap-2">
                  View Our Full Gallery <ChevronRight size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-[#F5B400] to-[#e5a500]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-4">What Our Clients Say</h3>
            <p className="text-xl text-[#2E2E2E]">Trusted by hundreds of Melbourne families</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Mitchell', text: 'Absolutely thrilled with our new deck! The team was professional, punctual, and the craftsmanship is outstanding. Highly recommend!', rating: 5 },
              { name: 'James Cooper', text: 'Our pergola transformed our backyard into an entertainer\'s paradise. Quality work and fair pricing. Couldn\'t be happier!', rating: 5 },
              { name: 'Emma Davidson', text: 'They restored our weatherboard home beautifully. Attention to detail was incredible and they respected our home throughout the project.', rating: 5 }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-[#F5B400] fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-bold text-[#2E2E2E]">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">Google Review</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-Page CTA */}
      <section className="py-20 bg-[#2E2E2E] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Start Your Next Project Today</h3>
          <p className="text-xl mb-8 text-gray-300">Fast quotes. No obligation. Honest pricing.</p>
          <a href="#contact" className="bg-[#F5B400] text-[#2E2E2E] px-10 py-4 rounded-lg font-bold text-lg hover:bg-[#e5a500] transition transform hover:scale-105 inline-block shadow-xl">
            Book a Consultation
          </a>
        </div>
      </section>

      {/* About / Founder Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/image copy.png" alt="Beautiful Pergola Construction" className="rounded-xl shadow-2xl" />
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-6">Building Trust, One Home at a Time</h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                For over a decade, My Home Constructions has been enhancing Melbourne homes with premium craftsmanship and personalized service. We understand that your home is more than just a building—it's where memories are made.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Every pergola, deck, and weatherboard project is approached with the same dedication to quality and attention to detail. We take pride in delivering results that exceed expectations and stand the test of time.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our team combines traditional building techniques with modern materials and design principles to create outdoor spaces and home exteriors that you'll love for years to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Quote Form */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-4">Get Your Free Quote</h3>
            <p className="text-xl text-gray-600">We'll be in touch within 24 hours</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
                <h4 className="text-2xl font-bold text-[#2E2E2E] mb-6">Contact Information</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F5B400] rounded-lg flex items-center justify-center">
                      <Phone size={24} className="text-[#2E2E2E]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2E2E2E]">Phone</p>
                      <a href="tel:0412345678" className="text-gray-600 hover:text-[#F5B400]">0412 345 678</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F5B400] rounded-lg flex items-center justify-center">
                      <Mail size={24} className="text-[#2E2E2E]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2E2E2E]">Email</p>
                      <a href="mailto:info@myhomeconstructions.com.au" className="text-gray-600 hover:text-[#F5B400]">info@myhomeconstructions.com.au</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F5B400] rounded-lg flex items-center justify-center">
                      <MapPin size={24} className="text-[#2E2E2E]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2E2E2E]">Service Area</p>
                      <p className="text-gray-600">Melbourne Metro & Surrounding Suburbs</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t">
                  <p className="text-sm text-gray-600 mb-2"><strong>Business Hours:</strong></p>
                  <p className="text-sm text-gray-600">Monday - Friday: 7:00am - 5:00pm</p>
                  <p className="text-sm text-gray-600">Saturday: 8:00am - 2:00pm</p>
                  <p className="text-sm text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
                      <CheckCircle size={40} className="text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-[#2E2E2E] mb-2">Thank You!</h4>
                    <p className="text-gray-600">We'll be in touch within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F5B400]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F5B400]"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Suburb *</label>
                        <input
                          type="text"
                          name="suburb"
                          value={formData.suburb}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F5B400]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F5B400]"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Project Type *</label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F5B400]"
                      >
                        <option value="">Select a service...</option>
                        <option value="pergola">Pergola</option>
                        <option value="decking">Decking</option>
                        <option value="weatherboard">Weatherboard Home</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F5B400]"
                        placeholder="Tell us about your project..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#F5B400] text-[#2E2E2E] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#e5a500] transition transform hover:scale-105 shadow-lg"
                    >
                      Request Free Quote
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2E2E2E] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-[#F5B400] font-bold text-lg mb-4">About</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Melbourne's trusted builder for pergolas, decking, and weatherboard homes. Quality craftsmanship since 2013.
              </p>
            </div>
            <div>
              <h4 className="text-[#F5B400] font-bold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="text-gray-400 hover:text-[#F5B400] transition">Pergolas</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-[#F5B400] transition">Decking</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-[#F5B400] transition">Weatherboard Homes</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-[#F5B400] transition">Free Quotes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#F5B400] font-bold text-lg mb-4">Service Areas</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Melbourne CBD</li>
                <li>Eastern Suburbs</li>
                <li>Western Suburbs</li>
                <li>Northern Suburbs</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#F5B400] font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="tel:0412345678" className="text-gray-400 hover:text-[#F5B400] transition">0412 345 678</a></li>
                <li><a href="mailto:info@myhomeconstructions.com.au" className="text-gray-400 hover:text-[#F5B400] transition">info@myhomeconstructions.com.au</a></li>
                <li className="text-gray-400">ABN: 12 345 678 901</li>
                <li className="text-gray-400">Lic: DB-U 12345</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 My Home Constructions. All rights reserved. | Proudly serving Melbourne, Victoria
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
