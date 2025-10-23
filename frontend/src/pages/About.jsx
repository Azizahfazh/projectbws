import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import aboutImage from "../assets/about-nailart.jpg"; // pastikan file ini ada di /src/assets/

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="p-0 m-0 text-gray-800 font-[Quicksand]">
      {/* Hero Section with Parallax */}
      <section
        className="relative w-full h-[70vh] p-0 m-0 -mt-16 bg-fixed bg-center bg-cover flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: `url(${aboutImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="relative z-10 text-center"
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          <h1 className="text-4xl font-bold md:text-5xl">About HYNailArt</h1>
          <p
            className="mt-3 text-lg italic text-pink-100"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            "Beauty begins at your fingertips."
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section
        className="max-w-4xl px-6 py-16 mx-auto text-center"
        data-aos="fade-up"
        data-aos-offset="200"
      >
        <h2 className="mb-6 text-3xl font-bold text-pink-500">
          Who We Are
        </h2>
        <p
          className="leading-relaxed text-gray-600 md:text-lg"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          HYNailArt hadir untuk memberikan pengalaman perawatan kuku yang tidak hanya
          indah, tetapi juga nyaman dan berkelas. Kami percaya bahwa keindahan bisa
          dimulai dari detail kecil — dari setiap sentuhan seni di ujung jari Anda.
          Dengan tenaga profesional dan bahan berkualitas tinggi, kami menghadirkan hasil
          yang tidak hanya cantik, tapi juga tahan lama dan aman.
        </p>
        <div
          className="mt-8"
          data-aos="zoom-in"
          data-aos-delay="250"
        >
          <Link
            to="/katalog"
            className="px-8 py-3 font-semibold text-white transition duration-300 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 hover:opacity-90 hover:scale-105"
          >
            Jelajahi Katalog Kami
          </Link>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-pink-50">
        <div className="max-w-6xl px-6 mx-auto">
          <h2
            className="mb-10 text-3xl font-bold text-center text-pink-500"
            data-aos="fade-up"
          >
            Visi & Misi
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Vision */}
            <div
              className="p-8 transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl"
              data-aos="fade-right"
            >
              <h3 className="mb-4 text-2xl font-semibold text-pink-500">
                Visi
              </h3>
              <p className="text-gray-600">
                Menjadi studio nail art terpercaya dan terinspirasi yang mampu
                menonjolkan keindahan, kreativitas, serta kepercayaan diri setiap
                wanita melalui karya seni kuku yang elegan dan modern.
              </p>
            </div>

            {/* Mission */}
            <div
              className="p-8 transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl"
              data-aos="fade-left"
            >
              <h3 className="mb-4 text-2xl font-semibold text-pink-500">
                Misi
              </h3>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>
                  Memberikan pelayanan nail art profesional dengan standar kualitas
                  terbaik.
                </li>
                <li>
                  Menginspirasi setiap pelanggan untuk mengekspresikan diri melalui
                  desain kuku yang kreatif dan personal.
                </li>
                <li>
                  Menjaga kebersihan, kenyamanan, dan keamanan dalam setiap layanan.
                </li>
                <li>
                  Terus berinovasi mengikuti tren kecantikan modern dengan produk yang
                  aman dan ramah lingkungan.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl px-6 mx-auto text-center">
          <h2
            className="mb-10 text-3xl font-bold text-pink-500"
            data-aos="fade-up"
          >
            Our Values
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                title: "Kreativitas",
                desc: "Kami selalu menghadirkan desain yang unik, inovatif, dan sesuai karakter setiap pelanggan.",
              },
              {
                title: "Kepedulian",
                desc: "Setiap sentuhan pelayanan kami dilakukan dengan ketulusan dan perhatian penuh terhadap kenyamanan pelanggan.",
              },
              {
                title: "Kepercayaan Diri",
                desc: "Kami percaya bahwa kuku yang indah dapat meningkatkan rasa percaya diri dan mencerminkan kepribadian Anda.",
              },
              {
                title: "Kualitas",
                desc: "Menggunakan produk berkualitas tinggi dan alat yang steril untuk memastikan hasil terbaik bagi setiap pelanggan.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 transition transform bg-pink-50 rounded-2xl hover:-translate-y-1 hover:shadow-lg"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <h4 className="mb-2 text-lg font-semibold text-pink-500">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
