window.siteContent = {
  profile: {
    name: "Zhen Qian",
    nativeName: "钱 振",
    displayName: "Zhen Qian (钱 振)",
    email: "zhen.qian@tum.de",
    affiliations: [
      "Technical University of Munich",
      "Potsdam Institute for Climate Impact Research",
    ],
    address: "Lise-Meitner-Straße 9-11, 85521 Ottobrunn, Munich, Germany",
  },
  navigation: [
    { label: "Home", href: "index.html", page: "home" },
    { label: "About", href: "about.html", page: "about" },
    { label: "Research", href: "research.html", page: "research" },
    { label: "Activities", href: "activities.html", page: "activities", hidden: true },
    { label: "Contact", href: "contact.html", page: "contact" },
  ],
  home: {
    title: "Zhen Qian (钱 振)",
    eyebrow: "Earth System Science · Spatiotemporal Intelligence",
    intro:
      "I am a doctoral researcher in Earth System Modeling. I use observations, physical models, and machine learning to study Earth system dynamics, extreme events, and climate impacts on ecosystems.",
    affiliation:
      "Doctoral researcher at the Technical University of Munich · Guest researcher at the Potsdam Institute for Climate Impact Research (PIK)",
    portrait: {
      src: "assets/img/qz.jpg",
      alt: "Portrait of Zhen Qian",
    },
  },
  about: {
    title: "About",
    introduction:
      "My path into Earth system science began with geoinformatics and remote sensing, and gradually expanded toward climate dynamics and data-driven modeling.",
    sections: [
      {
        title: "Current work",
        paragraphs: [
          "I am a doctoral researcher in Earth System Modeling at the Technical University of Munich and a guest researcher at the Potsdam Institute for Climate Impact Research.",
          "My current work develops probabilistic and physically informed modeling approaches to reconstruct Earth system states, investigate climate extremes, and support early warning of emerging risks.",
        ],
      },
      {
        title: "Academic path",
        paragraphs: [
          "Before moving to Germany, I trained in geoinformatics and remote sensing in China. Working with satellite observations and spatial data led me toward broader questions about climate, ecosystems, and the processes that connect them.",
          "That background still shapes how I approach research: I tend to move between observations, models, and computation rather than treating them as separate worlds.",
        ],
      },
      {
        title: "Research perspective",
        paragraphs: [
          "I am most interested in questions where complex spatiotemporal data, computational models, and Earth processes meet. I want data-driven methods to do more than predict well: they should expose uncertainty, remain scientifically interpretable, and work in concert with physics-based approaches to help us understand a changing planet.",
        ],
      },
      {
        title: "Beyond research",
        paragraphs: [
          "Outside research, I enjoy bouldering, hiking, and strength training. They offer a welcome change of scale from long-running models and large geospatial datasets.",
        ],
      },
    ],
  },
  research: {
    title: "Research",
    introduction:
      "I study a changing Earth system by combining climate science, geospatial observations, physical understanding, and machine learning.",
    directions: [
      {
        title: "Earth system dynamics",
        text:
          "Nonlinear dynamics, extreme events, tipping behavior, and land-atmosphere feedbacks, with an emphasis on mechanisms that can be recovered from incomplete observations.",
      },
      {
        title: "Climate impacts",
        text:
          "Vulnerability and resilience of ecosystems and urban infrastructure under climate change.",
      },
      {
        title: "Spatiotemporal intelligence",
        text:
          "Physics-aware and data-driven modeling, uncertainty quantification, and interpretable AI.",
      },
    ],
    projects: [
      {
        href: "https://arxiv.org/abs/2602.16515",
        image: "assets/img/papers/climate-system.jpg",
        imageAlt: "Reconstructed global historical climate fields",
        category: "Climate systems",
        title: "Generative deep learning improves reconstruction of global historical climate records",
        summary:
          "Recovering long-term global climate records to better understand historical warming, hydroclimate variability, and climate extremes.",
        venue: "arXiv:2602.16515, 2026",
      },
      {
        href: "https://arxiv.org/abs/2506.11879",
        image: "assets/img/papers/forest-system.jpg",
        imageAlt: "Global forest aboveground carbon patterns",
        category: "Forest ecosystems",
        title: "Decadal sink-source shifts of forest aboveground carbon since 1988",
        summary:
          "Tracing multi-decadal forest carbon dynamics to reveal emerging sink-source shifts and the changing role of tropical and boreal forests in the carbon cycle.",
        venue: "Nature Communications, 2026",
      },
      {
        href: "https://www.nature.com/articles/s41558-025-02276-3",
        image: "assets/img/papers/urban-system.jpg",
        imageAlt: "Global rooftop photovoltaic potential",
        category: "Urban systems",
        title: "Worldwide rooftop photovoltaic electricity generation may mitigate global warming",
        summary:
          "Assessing the global climate benefits of rooftop photovoltaics and their role in urban energy transitions and warming mitigation.",
        venue: "Nature Climate Change, 2025",
      },
      {
        href: "https://www.nature.com/articles/s43017-023-00452-7",
        image: "assets/img/papers/IESM.jpg",
        imageAlt: "Iterative Earth system modeling framework",
        category: "Earth system modeling",
        title: "Iterative integration of deep learning in hybrid Earth surface system modelling",
        summary:
          "Framing how deep learning and Earth system knowledge can be iteratively integrated to improve environmental modeling and scientific understanding.",
        venue: "Nature Reviews Earth & Environment, 2023",
      },
    ],
    links: [
      {
        label: "Google Scholar",
        href: "https://scholar.google.com/citations?user=X1w2lCUAAAAJ&hl=en",
        description: "Complete publication record and citation profile",
      },
      {
        label: "ORCID",
        href: "https://orcid.org/0000-0002-0423-7430",
        description: "Persistent researcher identifier and works",
      },
      {
        label: "GitHub",
        href: "https://github.com/ChanceQZ",
        description: "Research code and open-source projects",
      },
      {
        label: "Download CV",
        href: "assets/docs/CV_ZhenQian.pdf",
        description: "Academic experience, publications, and service",
      },
    ],
  },
  activities: {
    title: "Activities",
    introduction:
      "Selected research milestones, awards, publications, and academic activities.",
    items: [
      {
        date: "2024-08-29",
        dateLabel: "29 Aug 2024",
        type: "Publication",
        title: "Nature Geoscience paper accepted",
        text:
          'Our paper "Collaboration between artificial intelligence and Earth science communities for mutual benefit" was accepted by Nature Geoscience.',
      },
      {
        date: "2024-08-22",
        dateLabel: "22 Aug 2024",
        type: "Award",
        title: "Provincial Excellent Master's Thesis",
        text: "My master's thesis received the provincial excellent thesis award (top 1%).",
      },
      {
        date: "2024-08-17",
        dateLabel: "17 Aug 2024",
        type: "Publication",
        title: "The Innovation paper accepted",
        text:
          'Our paper "Artificial intelligence for geoscience: Progress, challenges and perspectives" was accepted by The Innovation.',
      },
      {
        date: "2024-08-13",
        dateLabel: "13 Aug 2024",
        type: "Publication",
        title: "Remote Sensing paper accepted",
        text:
          'Our paper "Assessment of Rooftop Photovoltaic Potential Considering Building Functions" was accepted by Remote Sensing.',
      },
      {
        date: "2024-07-29",
        dateLabel: "29 Jul 2024",
        type: "Publication",
        title: "Urban building-use study accepted",
        text:
          "Our work on urban building-use identification with remote sensing and social sensing data was accepted by Geo-spatial Information Science.",
      },
      {
        date: "2024-05-29",
        dateLabel: "29 May 2024",
        type: "Publication",
        title: "Global Martian crater catalog accepted",
        text:
          'Our paper "A global catalog of Martian impact craters with actual boundaries and degradation states" was accepted by IJAEOG.',
      },
      {
        date: "2024-03-29",
        dateLabel: "29 Mar 2024",
        type: "Publication",
        title: "Large-scale building information study accepted",
        text:
          "My first-authored paper on extracting building information from high-resolution satellite imagery was accepted by Sustainable Cities and Society.",
      },
      {
        date: "2024-02-08",
        dateLabel: "8 Feb 2024",
        type: "Publication",
        title: "Photovoltaic noise-barrier study accepted",
        text:
          'Our paper "Power generation assessment of photovoltaic noise barriers across 52 major Chinese cities" was accepted by Applied Energy.',
      },
      {
        date: "2023-10-29",
        dateLabel: "29 Oct 2023",
        type: "Preprint",
        title: "Multitask building-detail extraction released",
        text:
          'My work "Multi-task deep learning for large-scale building detail extraction from high-resolution satellite imagery" was released on arXiv.',
      },
      {
        date: "2023-10-11",
        dateLabel: "11 Oct 2023",
        type: "Publication",
        title: "Geo-simulation reproducibility paper accepted",
        text:
          'Our paper "Reproducing computational processes in service-based geo-simulation experiments" was accepted by IJAEOG.',
      },
      {
        date: "2023-08-11",
        dateLabel: "11 Aug 2023",
        type: "Publication",
        title: "Martian crater delineation paper accepted",
        text:
          'Our paper "Boundary delineator for Martian crater instances with geographic information and deep learning" was accepted by Remote Sensing.',
      },
      {
        date: "2023-05-25",
        dateLabel: "25 May 2023",
        type: "Publication",
        title: "Hybrid Earth system modeling review accepted",
        text:
          'Our paper "Iterative integration of deep learning in hybrid Earth surface system modeling" was accepted by Nature Reviews Earth & Environment.',
      },
      {
        date: "2023-04-23",
        dateLabel: "23 Apr 2023",
        type: "Award",
        title: "President's Scholarship for Postgraduates",
        text: "I received the President's Scholarship for Postgraduates.",
      },
      {
        date: "2023-04-14",
        dateLabel: "14 Apr 2023",
        type: "Publication",
        title: "Rooftop photovoltaic mitigation paper accepted",
        text:
          'Our paper "Carbon mitigation potential afforded by rooftop photovoltaic in China" was accepted by Nature Communications.',
      },
      {
        date: "2023-03-22",
        dateLabel: "22 Mar 2023",
        type: "Publication",
        title: "Geo-simulation documentation paper accepted",
        text:
          'Our paper "Documentation strategy for facilitating the reproducibility of geo-simulation experiments" was accepted by Environmental Modelling & Software.',
      },
      {
        date: "2022-11-27",
        dateLabel: "27 Nov 2022",
        type: "Publication",
        title: "Deep Solar PV Refiner accepted",
        text: 'Our paper "Deep Solar PV Refiner" was accepted by IJAEOG.',
      },
      {
        date: "2022-08-16",
        dateLabel: "16 Aug 2022",
        type: "Publication",
        title: "Roadside noise-barrier dataset accepted",
        text:
          'My first-authored paper "Vectorized dataset of roadside noise barriers in China using street view imagery" was accepted by Earth System Science Data.',
      },
      {
        date: "2022-01-12",
        dateLabel: "12 Jan 2022",
        type: "Publication",
        title: "Rooftop area dataset accepted",
        text:
          'Our paper "Vectorized rooftop area data for 90 cities in China" was accepted by Scientific Data.',
      },
      {
        date: "2022-01-09",
        dateLabel: "9 Jan 2022",
        type: "Publication",
        title: "Deep Roof Refiner accepted",
        text: 'My first-authored paper "Deep Roof Refiner" was accepted by IJAEOG.',
      },
      {
        date: "2020-07-28",
        dateLabel: "28 Jul 2020",
        type: "Publication",
        title: "Urban functional-area study accepted",
        text:
          'My first-authored paper "Identification of urban functional areas by coupling satellite images and taxi GPS trajectories" was accepted by Remote Sensing.',
      },
    ],
  },
  contact: {
    title: "Contact",
    introduction: "The best way to reach me is by email.",
    email: "zhen.qian@tum.de",
    affiliations: [
      "Technical University of Munich",
      "Potsdam Institute for Climate Impact Research",
    ],
    address: "Lise-Meitner-Straße 9-11, 85521 Ottobrunn, Munich, Germany",
  },
  footer: {
    text: "Zhen Qian (钱 振)",
  },
};
