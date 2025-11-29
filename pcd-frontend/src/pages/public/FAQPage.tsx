import FAQContent from '../../components/FAQContent';
import Footer from '../../components/Footer';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQContent />
        </div>
      </div>
      <Footer />
    </div>
  );
}