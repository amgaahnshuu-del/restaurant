import gustoLogo from "@/assets/gusto-logo.png";

const FooterSection = () => {
  return (
    <footer id="холбоо барих" className="py-20 px-8 lg:px-16 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <img src={gustoLogo} alt="Gusto Restaurant" className="h-16 w-auto mb-4 mx-auto md:mx-0" />
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Дээд зэргийн хоолны урлагийг таньд бэлэглэхэд бэлэн.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-primary mb-4">
              Цагийн хуваарь
            </h4>
            <div className="space-y-2 font-body text-sm text-muted-foreground">
              <p>Даваа – Баасан: 11:00 – 23:00</p>
              <p>Бямба – Ням: 10:00 – 00:00</p>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-primary mb-4">
              Холбоо барих
            </h4>
            <div className="space-y-2 font-body text-sm text-muted-foreground">
              <p>Улаанбаатар, Сүхбаатар дүүрэг</p>
              <p>+976 7700 1234</p>
              <p>info@gusto.mn</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            © 2024 Gusto. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
