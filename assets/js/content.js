(() => {
  const translations = {
    en: {
      meta: {
        title: "Cat With 9 Tales | Neha Verma",
        description:
          "Storytelling portfolio of Neha Verma, an Indian-Norwegian storyteller weaving bridges between cultures."
      },
      ui: {
        skipToContent: "Skip to content",
        toggleMenu: "Toggle menu"
      },
      nav: {
        home: "Home",
        about: "About",
        portfolio: "Portfolio",
        contact: "Contact"
      },
      hero: {
        kicker: "Storytelling Portfolio",
        title: "Cat With 9 Tales",
        identityShort: "Indian-Norwegian storyteller",
        mantra1: "9 Lives",
        mantra2: "9 Lenses",
        mantra3: "9 Tales",
        identity: "I am an Indian-Norwegian storyteller.",
        cta: "Begin the conversation"
      },
      about: {
        eyebrow: "About",
        heading: "Stories that build bridges",
        signoff: "Shall we try together?",
        paragraphs: [
          "Born in India, a culture steeped in rich and flowing story waters, I was raised loving tales and weaving generational yarns.",
          "In my family, elders were traditional Indian space-holding seekers of truth. They shared old folk tales and ancient myths, weaving them with present realities to offer refined perspectives for everyday life.",
          "I grew up with mythologies that never lost their link with the present and always reached toward the future. That is why I feel at home in the spaces that flow between worlds.",
          "Steeped in culture at the School of Life in India, and later educated at the School of Storytelling in England, I carry forward a third-generation lineage of stories in blood, bone, and practice.",
          "As an Indian-Norwegian, questions of belonging and identity, searching for roots, and building bridges between East and West have become deeply personal quests. The seeking itself gives me the colors and threads with which I now weave my own stories.",
          "In an increasingly chaotic world, where separation and otherness can pull us apart, this desire to build bridges feels more urgent than ever.",
          "How does one build a bridge? One step. One bend of the river. One stone at a time. I begin where I stand."
        ]
      },
      portfolio: {
        eyebrow: "Portfolio",
        heading: "A glimpse through nine lenses",
        intro: "Curated moments from performances, reflections, and journeys.",
        galleryHeading: "Full photo archive",
        galleryIntro: "Every frame in this collection sits inside a living body of story."
      },
      contact: {
        eyebrow: "Contact",
        heading: "Let us build one bridge, one story at a time.",
        body: "For performances, workshops, speaking invitations, or collaborations, write directly.",
        closing: "I begin where I stand. Shall we try together?"
      },
      footer: {
        line: "Cat With 9 Tales · Neha Verma"
      },
      captions: {
        neha: "Voice of many rivers",
        storytelling: "Carrying old wisdom forward",
        mothers: "Journeys held by generations",
        tomter: "Stories in shared civic spaces",
        candle: "Firelight and listening",
        audience: "Gathered in attentive silence"
      }
    },
    no: {
      meta: {
        title: "Cat With 9 Tales | Neha Verma",
        description:
          "Fortellerporteføljen til Neha Verma, en indisk-norsk forteller som bygger broer mellom kulturer."
      },
      ui: {
        skipToContent: "Hopp til innhold",
        toggleMenu: "Åpne eller lukk meny"
      },
      nav: {
        home: "Hjem",
        about: "Om",
        portfolio: "Portefølje",
        contact: "Kontakt"
      },
      hero: {
        kicker: "Fortellerportefølje",
        title: "Cat With 9 Tales",
        identityShort: "Indisk-norsk forteller",
        mantra1: "9 liv",
        mantra2: "9 linser",
        mantra3: "9 fortellinger",
        identity: "Jeg er en indisk-norsk forteller.",
        cta: "Start samtalen"
      },
      about: {
        eyebrow: "Om",
        heading: "Fortellinger som bygger broer",
        signoff: "Skal vi prøve sammen?",
        paragraphs: [
          "Jeg er født i India, i en kultur gjennomsyret av rike og levende fortellerstrømmer. Der vokste jeg opp med kjærlighet til historier og med generasjonsbånd vevd i ord.",
          "I familien min var de eldste tradisjonelle indiske, romholdende sannhetssøkere. De delte folkeeventyr og urgamle myter, og vevde dem inn i nåtiden for å gi mer nyanserte perspektiver i hverdagen.",
          "Jeg vokste opp med mytologier som aldri mistet forbindelsen til nåtiden, og som alltid strakte seg mot fremtiden. Derfor kjenner jeg meg hjemme i rommet mellom verdener.",
          "Formet av Livets skole i India, og senere utdannet ved School of Storytelling i England, bærer jeg videre en tredje generasjons fortellerlinje i blod, ben og praksis.",
          "Som indisk-norsk har spørsmål om tilhørighet og identitet, søken etter røtter og ønsket om å bygge broer mellom øst og vest blitt dypt personlige reiser. Selve søken gir meg fargene og trådene jeg vever mine egne fortellinger med.",
          "I en stadig mer kaotisk verden, der avstand og annerledeshet kan drive oss fra hverandre, kjennes denne brobyggingen mer presserende enn noen gang.",
          "Hvordan bygger man en bro? Ett steg. En sving i elven. En stein om gangen. Jeg begynner der jeg står."
        ]
      },
      portfolio: {
        eyebrow: "Portefølje",
        heading: "Et glimt gjennom ni linser",
        intro: "Utvalgte øyeblikk fra forestillinger, refleksjoner og reiser.",
        galleryHeading: "Fullt fotoarkiv",
        galleryIntro: "Hvert bilde i samlingen er en del av en levende fortellerkropp."
      },
      contact: {
        eyebrow: "Kontakt",
        heading: "La oss bygge én bro, én fortelling av gangen.",
        body: "For forestillinger, workshops, foredrag eller samarbeid kan du skrive direkte.",
        closing: "Jeg begynner der jeg står. Skal vi prøve sammen?"
      },
      footer: {
        line: "Cat With 9 Tales · Neha Verma"
      },
      captions: {
        neha: "Stemmen fra mange elver",
        storytelling: "Gammel visdom i ny bevegelse",
        mothers: "Reiser båret av generasjoner",
        tomter: "Fortellinger i felles møteplasser",
        candle: "Ildlys og lyttende nærvær",
        audience: "Samlet i oppmerksom stillhet"
      }
    }
  };

  const portfolioItems = [
    {
      id: "neha-verma",
      srcBase: "assets/images/optimized/neha-verma",
      width: 2200,
      height: 1586,
      featured: true,
      captionKey: "captions.neha",
      alt: {
        en: "Portrait of storyteller Neha Verma against warm stage light.",
        no: "Portrett av fortelleren Neha Verma i varmt scenelys."
      }
    },
    {
      id: "storytelling",
      srcBase: "assets/images/optimized/storytelling",
      width: 1645,
      height: 2200,
      featured: true,
      captionKey: "captions.storytelling",
      alt: {
        en: "Storytelling portrait from a live performance setting.",
        no: "Fortellerportrett fra en levende fremføringssituasjon."
      }
    },
    {
      id: "the-journeys-of-all-my-mothers",
      srcBase: "assets/images/optimized/the-journeys-of-all-my-mothers",
      width: 1094,
      height: 2200,
      featured: true,
      captionKey: "captions.mothers",
      alt: {
        en: "Artwork and title image for The Journeys of All My Mothers.",
        no: "Illustrasjon og tittelbilde for The Journeys of All My Mothers."
      }
    },
    {
      id: "tomter-innbyggertorg-og-bibliotek",
      srcBase: "assets/images/optimized/tomter-innbyggertorg-og-bibliotek",
      width: 2200,
      height: 1237,
      featured: true,
      captionKey: "captions.tomter",
      alt: {
        en: "Storytelling event setting at Tomter community library.",
        no: "Fortellersetting ved Tomter innbyggertorg og bibliotek."
      }
    },
    {
      id: "img-7325",
      srcBase: "assets/images/optimized/img-7325",
      width: 1226,
      height: 2200,
      featured: true,
      captionKey: "captions.candle",
      alt: {
        en: "Atmospheric portrait from a storytelling session in warm tones.",
        no: "Stemningsfullt portrett fra en fortellerstund i varme toner."
      }
    },
    {
      id: "e71e8dfc-68d6-4ce6-82eb-e9b5771a0ebc",
      srcBase: "assets/images/optimized/e71e8dfc-68d6-4ce6-82eb-e9b5771a0ebc",
      width: 2200,
      height: 1650,
      featured: true,
      captionKey: "captions.audience",
      alt: {
        en: "Documentary scene with listeners gathered during a cultural event.",
        no: "Dokumentarisk scene med publikum samlet under et kulturarrangement."
      }
    },
    {
      id: "1a0bd294-63b2-40f2-93ac-e0d70841cc9c",
      srcBase: "assets/images/optimized/1a0bd294-63b2-40f2-93ac-e0d70841cc9c",
      width: 1650,
      height: 2200,
      featured: false,
      captionKey: null,
      alt: {
        en: "Portrait photograph from Neha Verma's storytelling archive.",
        no: "Portrettfoto fra Neha Vermas fortellerarkiv."
      }
    },
    {
      id: "3ed0bddc-9eb2-49d7-a121-1c6e571a4849",
      srcBase: "assets/images/optimized/3ed0bddc-9eb2-49d7-a121-1c6e571a4849",
      width: 1650,
      height: 2200,
      featured: false,
      captionKey: null,
      alt: {
        en: "Performance image from a reflective storytelling evening.",
        no: "Fremføringsbilde fra en reflekterende fortellerkveld."
      }
    },
    {
      id: "50ab27b4-3d4a-4e32-a034-ca35dffd008a",
      srcBase: "assets/images/optimized/50ab27b4-3d4a-4e32-a034-ca35dffd008a",
      width: 1650,
      height: 2200,
      featured: false,
      captionKey: null,
      alt: {
        en: "Story portrait with layered textures and warm light.",
        no: "Fortellerportrett med lag av teksturer og varmt lys."
      }
    },
    {
      id: "img-2184",
      srcBase: "assets/images/optimized/img-2184",
      width: 2200,
      height: 1650,
      featured: false,
      captionKey: null,
      alt: {
        en: "Wide scene from a storytelling gathering.",
        no: "Bred scene fra en fortellersamling."
      }
    },
    {
      id: "img-5943",
      srcBase: "assets/images/optimized/img-5943",
      width: 2200,
      height: 1650,
      featured: false,
      captionKey: null,
      alt: {
        en: "Landscape-oriented photograph from a performance space.",
        no: "Landskapsorientert foto fra et fremføringsrom."
      }
    },
    {
      id: "img-6770",
      srcBase: "assets/images/optimized/img-6770",
      width: 2200,
      height: 1650,
      featured: false,
      captionKey: null,
      alt: {
        en: "Documentary photo from Neha Verma's creative journey.",
        no: "Dokumentarfoto fra Neha Vermas kreative reise."
      }
    },
    {
      id: "img-7294",
      srcBase: "assets/images/optimized/img-7294",
      width: 1566,
      height: 2200,
      featured: false,
      captionKey: null,
      alt: {
        en: "Vertical frame from a storytelling rehearsal moment.",
        no: "Vertikalt utsnitt fra et øyeblikk i fortellerøvelse."
      }
    },
    {
      id: "img-7295",
      srcBase: "assets/images/optimized/img-7295",
      width: 2200,
      height: 1243,
      featured: false,
      captionKey: null,
      alt: {
        en: "Panoramic detail from a performance environment.",
        no: "Panoramisk detalj fra et fremføringsmiljø."
      }
    },
    {
      id: "img-7297",
      srcBase: "assets/images/optimized/img-7297",
      width: 2200,
      height: 1227,
      featured: false,
      captionKey: null,
      alt: {
        en: "Panoramic still from a storytelling venue.",
        no: "Panoramisk stillbilde fra en fortellerarena."
      }
    },
    {
      id: "img-7299",
      srcBase: "assets/images/optimized/img-7299",
      width: 2200,
      height: 1233,
      featured: false,
      captionKey: null,
      alt: {
        en: "Wide composition showing atmosphere around a storytelling event.",
        no: "Bred komposisjon som viser stemningen rundt et fortellerarrangement."
      }
    },
    {
      id: "img-7300",
      srcBase: "assets/images/optimized/img-7300",
      width: 2200,
      height: 1225,
      featured: false,
      captionKey: null,
      alt: {
        en: "Environmental image from a staged storytelling context.",
        no: "Miljøbilde fra en iscenesatt fortellerkontekst."
      }
    },
    {
      id: "img-7301",
      srcBase: "assets/images/optimized/img-7301",
      width: 2200,
      height: 1623,
      featured: false,
      captionKey: null,
      alt: {
        en: "Performance still from Neha Verma's portfolio.",
        no: "Fremføringsstill fra Neha Vermas portefølje."
      }
    },
    {
      id: "img-7303",
      srcBase: "assets/images/optimized/img-7303",
      width: 2200,
      height: 1225,
      featured: false,
      captionKey: null,
      alt: {
        en: "Horizontal storytelling scene with layered texture.",
        no: "Horisontal fortellerscene med lagdelt tekstur."
      }
    },
    {
      id: "img-7308",
      srcBase: "assets/images/optimized/img-7308",
      width: 2200,
      height: 1243,
      featured: false,
      captionKey: null,
      alt: {
        en: "Venue detail image from a cultural storytelling program.",
        no: "Detaljbilde fra et kulturelt fortellerprogram."
      }
    },
    {
      id: "img-7309",
      srcBase: "assets/images/optimized/img-7309",
      width: 1559,
      height: 2200,
      featured: false,
      captionKey: null,
      alt: {
        en: "Vertical portrait from a live storytelling evening.",
        no: "Vertikalt portrett fra en levende fortellerkveld."
      }
    },
    {
      id: "img-7314",
      srcBase: "assets/images/optimized/img-7314",
      width: 1530,
      height: 2200,
      featured: false,
      captionKey: null,
      alt: {
        en: "Tall composition capturing movement in performance.",
        no: "Høy komposisjon som fanger bevegelse i fremføring."
      }
    },
    {
      id: "img-7316",
      srcBase: "assets/images/optimized/img-7316",
      width: 1335,
      height: 2200,
      featured: false,
      captionKey: null,
      alt: {
        en: "Portrait-oriented performance frame with dramatic contrast.",
        no: "Portrettorientert fremføringsramme med dramatisk kontrast."
      }
    },
    {
      id: "img-7319",
      srcBase: "assets/images/optimized/img-7319",
      width: 1334,
      height: 2200,
      featured: false,
      captionKey: null,
      alt: {
        en: "Vertical frame documenting a storytelling sequence.",
        no: "Vertikalt utsnitt som dokumenterer en fortellersekvens."
      }
    },
    {
      id: "img-7323",
      srcBase: "assets/images/optimized/img-7323",
      width: 1239,
      height: 2200,
      featured: false,
      captionKey: null,
      alt: {
        en: "Portrait frame from a contemplative narrative moment.",
        no: "Portrettutsnitt fra et kontemplativt fortellerøyeblikk."
      }
    },
    {
      id: "img-7348",
      srcBase: "assets/images/optimized/img-7348",
      width: 1697,
      height: 2200,
      featured: false,
      captionKey: null,
      alt: {
        en: "Story image with rich tones and textured backdrop.",
        no: "Fortellerbilde med rike toner og teksturert bakgrunn."
      }
    },
    {
      id: "img-8424",
      srcBase: "assets/images/optimized/img-8424",
      width: 2200,
      height: 1650,
      featured: false,
      captionKey: null,
      alt: {
        en: "Horizontal documentary shot from a storytelling project.",
        no: "Horisontalt dokumentarbilde fra et fortellerprosjekt."
      }
    },
    {
      id: "img-8557",
      srcBase: "assets/images/optimized/img-8557",
      width: 2200,
      height: 1650,
      featured: false,
      captionKey: null,
      alt: {
        en: "Environmental frame from an artistic storytelling context.",
        no: "Miljøutsnitt fra en kunstnerisk fortellerkontekst."
      }
    },
    {
      id: "img-9897",
      srcBase: "assets/images/optimized/img-9897",
      width: 2200,
      height: 1650,
      featured: false,
      captionKey: null,
      alt: {
        en: "Landscape composition from Neha Verma's visual archive.",
        no: "Landskapskomposisjon fra Neha Vermas visuelle arkiv."
      }
    }
  ];

  window.siteContent = {
    translations,
    portfolioItems
  };
})();
