import AboutSection from '../components/AboutSection';
import ContactUs from '../components/ContactUs';
import CoursesSection from '../components/CoursesSection';
import CurriculumSection from '../components/CurriculumSection';
import Footer from '../components/Footer';
import GalleryPhotoSection from '@/components/GalleryPhotoSection';
import GallerySection from '../components/GallerySection';
import GalleryVideoSection from '@/components/GalleryVideoSection';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import TestimonialSection from '../components/TestimonialSection';

export default function Home() {
    return (
        <>
            <Header />
            <HeroSection />
            <AboutSection />
            <CoursesSection />
            <CurriculumSection />
            <GalleryPhotoSection />
            <GalleryVideoSection />
            {/* <GallerySection /> */}
            <TestimonialSection />
            <ContactUs />
            <Footer />
        </>
    );
}