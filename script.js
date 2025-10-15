(function(){
  const defaultConfig = {
    site: { title: "WENTRA — RGB Landing", favicon: "favicon.ico" },
    brand: {
      name: "WENTRA.LUA",
      taglineMain: "75'den fazla özellik ile piyasada rakipsiz!",
      taglineAlt: "Bir babadır bizim için."
    },
    discordInvite: "https://discord.gg/wentrashop",
    payments: ["PAPARA", "IBAN", "EPIN", "ITEMSATIS"],
    pricing: [
      { name: "1 Hafta Lisans", price: "800₺", features: ["7 gün tam kullanım hakkı", "Güncellemeler ve destek dahil", "Hızlı kurulum"], featured: false },
      { name: "1 Ay Lisans", price: "1350₺", features: ["30 gün sınırsız erişim", "Güncellemeler ve destek dahil", "Performans odaklı"], featured: false },
      { name: "2 Ay Lisans", price: "2250₺", features: ["60 gün sınırsız erişim", "Güncellemeler ve destek dahil", "Özelleştirilebilir ayarlar"], featured: false },
      { name: "3 Ay Lisans", price: "3250₺", features: ["90 gün sınırsız erişim", "Güncellemeler ve destek dahil", "Öncelikli destek"], featured: false },
      { name: "Sınırsız Lisans", price: "4500₺", features: ["Ömür boyu erişim", "Güncellemeler ve destek dahil", "Tek sefer ödeme"], featured: true }
    ],
    theme: { rgbSpeedMs: 12000 }
  };

  async function loadConfig(){
    try{
      const res = await fetch("config.json", { cache: "no-store" });
      if(!res.ok) throw new Error("Config fetch failed: " + res.status);
      return await res.json();
    }catch(err){
      console.warn("config.json yüklenemedi, varsayılan değerler kullanılacak.", err);
      return defaultConfig;
    }
  }

  function setTheme(theme){
    const speed = (theme && theme.rgbSpeedMs) ? theme.rgbSpeedMs : 12000;
    document.documentElement.style.setProperty("--rgb-speed", `${Math.max(3000, Number(speed))}ms`);
  }

  function setFavicon(src){
    if(!src) return;
    const link = document.getElementById("faviconLink");
    if(link) link.href = src;
  }

  function text(el, value){ if(el) el.textContent = value; }

  function renderPricing(container, plans, discord){
    container.innerHTML = "";
    const fragment = document.createDocumentFragment();

    plans.forEach((plan)=>{
      const card = document.createElement("article");
      card.className = "card" + (plan.featured ? " featured" : "");

      const h3 = document.createElement("h3");
      h3.textContent = plan.name;
      card.appendChild(h3);

      const price = document.createElement("div");
      price.className = "price";
      price.textContent = plan.price;
      card.appendChild(price);

      const ul = document.createElement("ul");
      (plan.features || []).slice(0,3).forEach((f)=>{
        const li = document.createElement("li");
        li.textContent = f;
        ul.appendChild(li);
      });
      card.appendChild(ul);

      const btn = document.createElement("button");
      btn.className = "btn";
      btn.type = "button";
      btn.textContent = "Satın Al";
      btn.addEventListener("click", ()=>{
        window.open(discord, "_blank", "noopener");
      });
      card.appendChild(btn);

      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  }

  function render(cfg){
    // Meta
    document.title = (cfg.site && cfg.site.title) || defaultConfig.site.title;
    setFavicon(cfg.site && cfg.site.favicon);
    setTheme(cfg.theme);

    // Brand & taglines
    text(document.getElementById("brandName"), cfg.brand?.name || defaultConfig.brand.name);
    text(document.getElementById("taglineMain"), cfg.brand?.taglineMain || defaultConfig.brand.taglineMain);
    text(document.getElementById("taglineAlt"), cfg.brand?.taglineAlt || defaultConfig.brand.taglineAlt);

    // Payments
    const pay = Array.isArray(cfg.payments) ? cfg.payments.join(" / ") : defaultConfig.payments.join(" / ");
    text(document.getElementById("paymentMethods"), pay);

    // Discord links
    const invite = cfg.discordInvite || defaultConfig.discordInvite;
    const discordEls = ["discordTop", "discordCta", "discordBottom"]; 
    discordEls.forEach(id=>{
      const a = document.getElementById(id);
      if(a){ a.href = invite; }
    });

    // Pricing
    const cardsEl = document.getElementById("pricingCards");
    renderPricing(cardsEl, cfg.pricing || defaultConfig.pricing, invite);

    // Footer
    const year = new Date().getFullYear();
    text(document.getElementById("footerYear"), String(year));
    text(document.getElementById("footerBrand"), cfg.brand?.name || defaultConfig.brand.name);
  }

  loadConfig().then(render);
})();
