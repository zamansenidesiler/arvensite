const tr = {
  nav: {
    about: 'Hakkımda',
    gallery: 'Galeri',
    services: 'Hizmetler',
    faq: 'SSS',
    contact: 'İletişim',
  },
  hero: {
    badge: 'FiveM Özel',
    line1: 'ÖZEL',
    line2: 'GİYSİ',
    line3: 'TASARIMI',
    sub: 'FiveM sunucunuz için el yapımı, özel giysi koleksiyonları. Her dikiş, her piksel — mükemmeliyetle işlenmiştir.',
    cta: 'Galeriyi Gör',
    ctaSecondary: 'İletişime Geç',
    scroll: 'Kaydır',
  },
  marquee: ['PREMİUM TASARIMLAR', 'FİVEM ÖZEL', 'ÖZEL GİYSİ', 'EŞSİZ STİLLER', 'YÜKSEK KALİTE', 'ÖZENLE HAZIRLANDI'],
  about: {
    badge: 'Hakkımda',
    title: 'Sanal dünyalar için dijital moda tasarlıyorum',
    p1: "FiveM için premium özel giysi dokuları oluşturma konusunda uzmanlaşıyorum. Detaylara dikkat eden gözüm ve sokak modası estetiğine olan tutkumla, gerçek dünya moda anlayışını dijital aleme taşıyorum.",
    p2: 'Her tasarım, oyun içinde çarpıcı görünmesi için titizlikle hazırlanmaktadır; aydınlatma, doku kalitesi ve otantik markalaşmaya dikkat edilerek.',
    stat1: { value: 200, suffix: '+', label: 'Tasarım Oluşturuldu' },
    stat2: { value: 50, suffix: '+', label: 'Mutlu Sunucu' },
    stat3: { value: 3, suffix: '+', label: 'Yıl Deneyim' },
  },
  trust: {
    badge: 'Neden Arvenmods?',
    title: 'Müşterilerimiz Bizi Tercih Ediyor',
    online: 'Çevrimiçi',
    delivered: 'İletildi ✓',
    messages: [
      { role: 'client',  text: 'Merhaba! Ekibim için özel çete kıyafeti istiyorum 🔥' },
      { role: 'support', text: 'Harika bir tercih! Hangi tema veya konsept üzerinde düşünüyorsunuz?' },
      { role: 'client',  text: 'Sokak modası ağırlıklı, 6 farklı karakter için kombin set lazım.' },
      { role: 'support', text: 'Anlıyorum! Sıfırdan, tamamen özgün ve FPS dostu tasarımlar yapıyoruz. Discord\'dan hemen başlayalım mı? 💜' },
    ],
    stats: [
      { value: '200+', label: 'Tamamlanan Tasarım',  desc: 'Her biri özgün konseptle sıfırdan üretildi.',      glow: 'rgba(245,158,11,0.18)' },
      { value: '%100', label: 'FPS Optimize',         desc: 'LOD desteğiyle sunucu performansı etkilenmez.',    glow: 'rgba(251,191,36,0.14)' },
      { value: '7/24', label: 'Discord Destek',       desc: 'Sorunuz olduğunda her zaman ulaşabilirsiniz.',    glow: 'rgba(245,158,11,0.12)' },
    ],
  },
  gallery: {
    badge: 'Portfolyo',
    title: 'Öne Çıkan Tasarımlar',
    subtitle: 'Özel giysi parçalarımdan özenle seçilmiş bir koleksiyon',
    all: 'Tümü',
    jacket: 'Ceketler',
    top: 'Üstler',
    pants: 'Pantolonlar',
    set: 'Kombin Setler',
    hover: 'Tasarımı Gör',
  },
  services: {
    badge: 'Hizmetler',
    title: 'Neler Sunuyorum',
    subtitle: 'Sunucunuza özel premium giysi çözümleri',
    items: [
      {
        icon: '◈',
        title: 'Özel Ceketler',
        desc: 'Markanız ve vizyonunuza göre sıfırdan tasarlanmış premium bomber, deri ve sokak ceketleri.',
      },
      {
        icon: '◈',
        title: 'Tam Kombin Setler',
        desc: 'Üst, alt ve aksesuar dahil eksiksiz giysi paketleri — oyun içi görünüm için tam uyum.',
      },
      {
        icon: '◈',
        title: 'Çete ve Ekip Giysileri',
        desc: 'Roleplay çeteleriniz, organizasyonlarınız, kolluk ve sivil gruplar için özel üniforma setleri.',
      },
      {
        icon: '◈',
        title: 'Marka Replikalrı',
        desc: 'Gerçek dünya sokak modası markalarının FiveM ortamı için yüksek kalitede yeniden oluşturulmuş halleri.',
      },
    ],
  },
  process: {
    badge: 'Nasıl Çalışır',
    title: 'Basit. Net. Teslim Edilir.',
    steps: [
      { num: '01', title: 'İletişime Geç', desc: 'Giysi konseptiniz ve referans görsellerinizle Discord üzerinden bana ulaşın.' },
      { num: '02', title: 'Görüş ve Fiyat', desc: 'Gereksinimlerinizi konuşup şeffaf bir fiyat teklifi sunarım.' },
      { num: '03', title: 'Tasarla ve Oluştur', desc: 'Düzenli ilerleme güncellemeleriyle giysinizi oluştururum.' },
      { num: '04', title: 'Teslim', desc: 'FiveM sunucunuza hazır bitmiş dosyaları teslim alırsınız.' },
    ],
  },
  contact: {
    badge: 'İletişim',
    line1: 'BİRLİKTE',
    line2: 'MUHTEŞEM',
    line3: 'ŞEYLER YAPALIM',
    sub: 'Sunucunuzun moda oyununu bir üst seviyeye taşımaya hazır mısınız? Ulaşın ve vizyonunuzu konuşalım.',
    discord: "Discord'a Katıl",
    or: 'ya da beni bul',
  },
  faq: {
    badge: 'SSS',
    titleA: 'Sıkça',
    titleB: 'Sorulan',
    titleC: 'Sorular',
    subtitle: 'Aklınızdaki soruların yanıtları.',
    items: [
      {
        q: 'Bir tasarım ne kadar sürede teslim edilir?',
        a: 'Tasarımın karmaşıklığına göre çoğu iş 3-7 gün içinde teslim edilir. Acil projeler için öncelikli teslimat seçeneği sunuyoruz.',
      },
      {
        q: 'Tasarımlar FPS performansını etkiler mi?',
        a: 'Hayır. Tüm giysiler LOD desteğiyle optimize edilir; sunucu ve oyuncu performansı etkilenmez, akıcı kalır.',
      },
      {
        q: 'ESX ve QBCore ile uyumlu mu?',
        a: 'Evet. Tasarımlar tüm FiveM framework\'leriyle (ESX, QBCore, vMenu vb.) sorunsuz çalışacak şekilde paketlenir.',
      },
      {
        q: 'Sıfırdan tamamen özel tasarım yapıyor musunuz?',
        a: 'Kesinlikle. Konseptinizi Discord\'dan paylaşın; size özel, tamamen özgün ve telifsiz tasarımlar oluşturalım.',
      },
      {
        q: 'Revizyon hakkı var mı?',
        a: 'Evet. Teslimattan önce makul sayıda revizyon dahildir; tasarımdan tam memnun kalmanızı sağlıyoruz.',
      },
      {
        q: 'Ödeme nasıl yapılıyor?',
        a: 'Discord üzerinden iletişime geçip işi onayladıktan sonra güvenli ödeme yöntemleri sunulur.',
      },
    ],
  },
  footer: {
    rights: 'Tüm hakları saklıdır.',
    tagline: 'FiveM modasını yükseltiyor, bir tasarım bir seferde.',
  },
}

export default tr
