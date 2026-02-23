export type Language = 'EN' | 'AR';

export interface Translations {
  // Header & Navigation
  header: {
    home: string
    shop: string
    sodamakers: string
    flavor: string
    accessories: string
    co2: string
    recipes: string
    contactUs: string
    offers: string
    trackOrder: string
    userMenu: string
    refillCylinder: string
    refill: string
  }

  // Banner
  banner: {
    messages: {
      freeDelivery: string
      colaFlavors: string
      firstOrderDiscount: string
      megaOffer: string
      cylinderRefill: string
    }
    codes: {
      cola44: string
      new25: string
    }
  }

  // Banner section headings (used on home and individual pages)
  banners: {
    premiumItalianSyrups: { title: string; subtitle: string }
    colaBundle: string
    easyRefill: string
  }

  // Homepage
  home: {
    hero: {
      title: string
      subtitle: string
      description: string
      exploreMore: string
      buyNow: string
    }
    refill: {
      title: string
      description: string
      buttonText: string
      offerText: string
      carbonatesUpto: string
      liters: string
      litersOfDrink: string
      slide2: {
        headline: string
        description: string
        buttonText?: string
      }
      slide3: {
        headline: string
        description: string
        buttonText: string
      }
    }
    features: {
      title: string
      subtitle: string
      feature1: {
        title: string
        description: string
      }
      feature2: {
        title: string
        description: string
      }
      feature3: {
        title: string
        description: string
      }
    }
    products: {
      title: string
      subtitle: string
      viewAll: string
    }
    testimonials: {
      title: string
      subtitle: string
      testimonial1: {
        text: string
        author: string
        role: string
      }
      testimonial2: {
        text: string
        author: string
        role: string
      }
      testimonial3: {
        text: string
        author: string
        role: string
      }
    },
    carousel: {
      slide1: {
        headline: string
        description: string
        buttonText: string
        offerText: string
        carbonatesUpto: string
        liters: string
        litersOfDrink: string
      }
      slide2: {
        headline: string
        description: string
        buttonText: string
      }
      slide3: {
        headline: string
        description: string
        buttonText: string
      }
    },
    productCategories: {
      title: string
      sodaMakers: string
      co2: string
      premiumItalianFlavors: string
      accessories: string
    },
    megaOffer: {
      title: string
      description: string
      availableColors: string
      offersBundles: string
      exploreMore: string
    },
    howItWorks: {
      title: string
      subtitle: string
      description: string
      steps: {
        step1: {
          title: string
          description: string
          alt: string
        }
        step2: {
          title: string
          description: string
          alt: string
        }
        step3: {
          title: string
          description: string
          alt: string
        }
        step4: {
          title: string
          description: string
          alt: string
        }
      }
    },
    co2Section: {
      title: string
      litersOfDrinks: string
      description: string
      descriptionAr: string
      learnMore: string
      learnMoreAr: string
      ShopNow: string
      ShopNowAr: string
      exploreSubscriptions: string
      exploreSubscriptionsAr: string
      benefits: {
        easyExchange: string
        easyExchangeAr: string
        sustainable: string
        sustainableAr: string
        fizzReady: string
        fizzReadyAr: string
      }
    },
    flavorSection: {
      subtitle: string
      title: string
      description: string
      exploreFlavors: string
    },
    additionalSections: {
      howToUse: {
        title: string
        description: string
      },
      recipes: {
        title: string
        description: string
      },
      premiumFlavors: {
        title: string
        description: string
      }
    },
    environmental: {
      subtitle: string
      title: string
      plasticImpact: string
      naturalFlavors: string
      healthBenefits: string
    }
  }

  // Cylinders mediator page (/cylinders)
  cylinders: {
    banner: {
      title: string
      subtitle: string
    }
    cardNew: {
      title: string
      description: string
      shopNow: string
      imageAlt: string
    }
    cardRefill: {
      title: string
      description: string
      shopNow: string
      imageAlt: string
    }
    effortless: {
      title: string
      quickRefill: string
      spareCylinder: string
      foodGrade: string
      ecoFriendly: string
    }
    exchangeBanner: {
      title: string
      description: string
      shopNow: string
      imageAlt: string
    }
  }

  // Shop
  shop: {
    title: string
    subtitle: string
    description: string
    co2BannerHeading: string
    hero: {
      title: string
      subtitle: string
      description: string
    }
    refill: {
      title: string
      description: string
      buttonText: string
      offerText: string
      carbonatesUpto: string
      liters: string
      litersOfDrink: string
      slide2: {
        headline: string
        description: string
        buttonText?: string
      }
      slide3: {
        headline: string
        description: string
        buttonText: string
      }
    }
    bundles: {
      title: string
      subtitle: string
      description: string
      starterKit: string
      familyPack: string
      premiumBundle: string
      starterKitDescription: string
      familyPackDescription: string
      premiumBundleDescription: string
      starterKitItems: string
      familyPackItems: string
      premiumBundleItems: string
      includes: string
      save: string
      shopNow: string
      getPopularBundle: string
      limitedTimeOffer: string
      bestSeller: string
      mostPopular: string
      limitedTimeOfferText: string
    }
    filters: {
      all: string
      machines: string
      flavors: string
      accessories: string
      showing: string
      products: string
      sortBy: string
      featured: string
      priceLowToHigh: string
      priceHighToLow: string
      highestRated: string
      newest: string
      loadMore: string
      quickStats: string
      totalProducts: string
      categories: string
      brands: string
      inStock: string
      filters: string
      priceRange: string
      minPrice: string
      maxPrice: string
      customerRating: string
      availability: string
      specialOffers: string
      allCategories: string
      inStockOnly: string
      newProducts: string
      bestSellers: string
      onSale: string
      clearAll: string
      showResults: string
      productsFound: string
    }
    search: {
      placeholder: string
      helpText: string
      searchingFor: string
      results: string
      clearSearch: string
    }
    sort: {
      mostPopular: string
      priceLowToHigh: string
      priceHighToLow: string
      newestFirst: string
      highestRated: string
      helpText: string
    }
    pagination: {
      previous: string
      next: string
    }
    contact: {
      hero: { title: string; subtitle: string }
      options: {
        heading: string
        whatsapp: { title: string; availability: string; button: string }
        email: { title: string; availability: string; button: string }
        chat: {
          title: string
          checking: string
          loginRequired: string
          avgReply: string
          opensAt: string
          buttonLoading: string
          buttonLogin: string
          buttonStart: string
        }
        show: string
        hide: string
      }
      status: { available: string; offline: string; always: string; loginRequired: string }
      form: {
        title: string
        subtitle: string
        reason: string
        reasons: {
          general: string
          order: string
          billing: string
          technical: string
          refund: string
          other: string
        }
        name: string
        namePlaceholder: string
        nameRequired: string
        email: string
        emailPlaceholder: string
        emailRequired: string
        phone: string
        phoneHint: string
        message: string
        messagePlaceholder: string
        messageMin: string
        attachments: string
        uploadBtn: string
        uploadHint: string
        consent: string
        submit: string
        submitting: string
        errors: {
          fillAll: string
          consent: string
          maxFiles: string
          fileTooLarge: string
          invalidType: string
          submitFail: string
        }
        success: {
          heading: string
          subtitle: string
          another: string
        }
        history: {
          title: string
          yourMessage: string
          ourResponse: string
        }
      }
      faq: {
        heading: string
        searchPlaceholder: string
        cta: string
        categories: {
          orders: string
          refill: string
          returns: string
          payment: string
        }
        viewAll: string
        emailSubject: string
        emailBody: string
      }
      map: {
        visit: string
        seeUs: string
        officeInfo: string
        address: string
        businessHours: string
        phone: string
        getDirections: string
        googleMaps: string
        appleMaps: string
        city: string
        country: string
      }
    }
    categoryPages: {
      explorePremium: string
      loadingProducts: string
      failedToLoad: string
      noProductsFound: string
      checkBackLater: string
      errorLoading: string
      omnifizzTitle: string
      omnifizzDescription: string
      luxeTitle: string
      luxeDescription: string
      activeFilters: string
      tryAgain: string
      filterApplied: string
      filtersApplied: string
      trySearchingFor: string
      shopByCategory: string
      discoverCollection: string
      shopAllProducts: string
      sodamakers: {
        title: string
      }
      flavors: {
        title: string
      }
      accessories: {
        title: string
      }
      co2: {
        title: string
      }
    }
    products: {
      addToCart: string
      selectOptions: string
      outOfStock: string
      new: string
      popular: string
      discount: string
      verified: string
      reviews: string
      rating: string
      productNames: {
        drinkmateRed: string
        drinkmateBlue: string
        drinkmateBlack: string
        co2Cylinder: string
        strawberryLemonSyrup: string
        premiumFlavorsPack: string
        bottlesSet: string
        energyColaFlavors: string
      }
      categories: {
        sodaMakers: string
        co2: string
        italianFlavors: string
        accessories: string
      }
    }

    customerReviews: {
      title: string
      subtitle: string
      description: string
      joinCustomers: string
      experienceDifference: string
      verified: string
      reviews: {
        sarah: {
          name: string
          location: string
          review: string
          date: string
        }
        ahmed: {
          name: string
          location: string
          review: string
          date: string
        }
        fatima: {
          name: string
          location: string
          review: string
          date: string
        }
        omar: {
          name: string
          location: string
          review: string
          date: string
        }
        layla: {
          name: string
          location: string
          review: string
          date: string
        }
        youssef: {
          name: string
          location: string
          review: string
          date: string
        }
      }
    }
    promotional: {
      limitedTimeOffer: string
      saveUpTo: string
      selectedItems: string
      dontMissOut: string
      shopDeals: string
      shopNow: string
      limitedTimeOfferText: string
    }
    productDetail: {
      breadcrumb: {
        shop: string
        category: string
        product: string
      }
      badges: {
        new: string
        popular: string
        discount: string
        lowStock: string
      }
      imageCounter: {
        of: string
      }
      rating: {
        outOf5: string
        reviews: string
        verifiedPurchase: string
        basedOn: string
        verifiedReviews: string
        helpful: string
        reply: string
      }
      options: {
        availableColors: string
        availableSizes: string
        quantity: string
      }
      actions: {
        addToCart: string
        outOfStock: string
        addToWishlist: string
        addBundleToCart: string
        addedToCart: string
        removeFromWishlist: string
      }
      features: {
        keyFeatures: string
        bundleBenefits: string
        whatsIncluded: string
      }
      trust: {
        freeShipping: string
        warranty: string
        easyReturns: string
        twoYearWarranty: string
      }
      tabs: {
        productInformation: string
        completeDetails: string
        productDescription: string
        technicalSpecifications: string
        customerReviews: string
        bundleSpecifications: string
        outOf5: string
        basedOn: string
        verified: string
      }
      related: {
        youMightAlsoLike: string
        products: {
          drinkmateRed: string
          co2Cylinder: string
          strawberryLemon: string
        }
        categories: {
          sodaMakers: string
          co2: string
          italianFlavors: string
        }
      }
      products: {
        names: {
          drinkmateRed: string
          drinkmateBlue: string
          drinkmateBlack: string
          co2Cylinder: string
          strawberryLemonSyrup: string
          premiumFlavorsPack: string
          bottlesSet: string
          energyColaFlavors: string
        }
        categories: {
          sodaMakers: string
          co2: string
          italianFlavors: string
          accessories: string
        }
        descriptions: {
          drinkmateRed: string
          drinkmateBlue: string
          drinkmateBlack: string
          co2Cylinder: string
          strawberryLemonSyrup: string
          premiumFlavorsPack: string
          bottlesSet: string
          energyColaFlavors: string
        }
        specifications: {
          dimensions: string
          weight: string
          material: string
          powerSource: string
          capacity: string
          co2Compatibility: string
          warranty: string
          countryOfOrigin: string
          volume: string
          ingredients: string
          origin: string
          allergens: string
          shelfLife: string
          storage: string
          serving: string
          certification: string
          contents: string
          totalVolume: string
          sealType: string
          dishwasherSafe: string
          bpaFree: string
          safety: string
          compatibility: string
          refillable: string
        }
        specificationValues: {
          dimensions: string
          weight: string
          material: string
          powerSource: string
          capacity: string
          co2Compatibility: string
          warranty: string
          countryOfOrigin: string
          volume: string
          ingredients: string
          origin: string
          allergens: string
          shelfLife: string
          storage: string
          serving: string
          certification: string
          contents: string
          totalVolume: string
          sealType: string
          dishwasherSafe: string
          bpaFree: string
          safety: string
          compatibility: string
          refillable: string
        }
        features: {
          carbonatesAnyLiquid: string
          advancedPressureRelease: string
          ergonomicDesign: string
          foodGradeMaterials: string
          compatibleWithCo2: string
          easyToClean: string
          portableLightweight: string
          noElectricityRequired: string
          highGradeSteel: string
          builtInSafetyValve: string
          refillableExchange: string
          longLastingPerformance: string
          authenticItalianRecipe: string
          naturalIngredients: string
          perfectBalance: string
          makesDrinks: string
          halalCertified: string
          longShelfLife: string
          noArtificialPreservatives: string
          versatileDrinks: string
          premiumCollection: string
          varietyFlavors: string
          restaurantQuality: string
          greatValuePack: string
          completeSet: string
          secureSeal: string
          perfectStorage: string
          classicCola: string
          naturalEnergy: string
          refreshingTaste: string
        }
        colors: {
          red: string
          blue: string
          black: string
          silver: string
          clear: string
          brown: string
          mixed: string
        }
        sizes: {
          standard: string
          sixtyLiters: string
          fiveHundredMl: string
          oneLiterX4: string
          eightX500ml: string
        }
        currency: {
          sar: string
          save: string
        }
        reviews: {
          sarahAlMansouri: string
          ahmedHassan: string
          fatimaZahra: string
          riyadhSaudiArabia: string
          jeddahSaudiArabia: string
          dammamSaudiArabia: string
          twoWeeksAgo: string
          oneMonthAgo: string
          threeWeeksAgo: string
          sarahReview: string
          ahmedReview: string
          fatimaReview: string
        }
      }
      bundleDetail: {
        whatsIncluded: string
        quantity: string
        addBundleToCart: string
        addToWishlist: string
        bundleBenefits: string
        bundleSpecifications: string
        save: string
        bundles: string
        mostPopular: string
        addedToCart: string
        removeFromWishlist: string
        addedToWishlist: string
        familyBundle: {
          title: string
          description: string
          items: string
          features: string[]
          specifications: Record<string, string>
        }
        starterBundle: {
          title: string
          description: string
          items: string
          features: string[]
          specifications: Record<string, string>
        }
        premiumBundle: {
          title: string
          description: string
          items: string
          features: string[]
          specifications: Record<string, string>
        }
        features: {
          completeSetup: string
          multipleCylinders: string
          varietyFlavors: string
          familyGatherings: string
          greatValue: string
          easyUse: string
        }
        specifications: {
          sodaMaker: string
          co2Cylinders: string
          flavorsIncluded: string
          totalValue: string
          bundleSavings: string
          warranty: string
          // Starter bundle specific values
          starterSodaMaker: string
          starterCo2Cylinders: string
          starterFlavors: string
          starterTotalValue: string
          starterBundleSavings: string
          starterWarranty: string
          // Family bundle specific values
          familySodaMaker: string
          familyCo2Cylinders: string
          familyFlavors: string
          familyTotalValue: string
          familyBundleSavings: string
          familyWarranty: string
          // Premium bundle specific values
          premiumSodaMaker: string
          premiumCo2Cylinders: string
          premiumFlavors: string
          premiumTotalValue: string
          premiumBundleSavings: string
          premiumWarranty: string
        }
      }
    }
  }

  // CO2
  co2: {
    hero: {
      title: string
      subtitle: string
      description: string
      orderCO2: string
      learnMore: string
      drinksLabel: string
      liters: string
    }
    productOptions: {
      title: string
      subtitle: string
      singleCylinder: {
        title: string
        description: string
        capacity: string
        price: string
        lifespan: string
        orderNow: string
      }
      exchangeProgram: {
        title: string
        description: string
        exchangeFee: string
        convenience: string
        ecoFriendly: string
        exchangeNow: string
      }
      bulkOrders: {
        title: string
        description: string
        minQuantity: string
        discount: string
        delivery: string
        getQuote: string
      }
    }
    refillServices: {
      title: string
      subtitle: string
      safetyFirst: {
        title: string
        description: string
        foodGradeCertification: string
        regularSafetyInspections: string
        properHandlingProcedures: string
        emergencyProtocols: string
      }
      convenientDelivery: {
        title: string
        description: string
        sameDayDelivery: string
        flexibleScheduling: string
        professionalHandling: string
        realTimeTracking: string
      }
    }
    exchangeProgram: {
      title: string
      subtitle: string
      howItWorks: string
      step1: {
        title: string
        description: string
      }
      step2: {
        title: string
        description: string
      }
      step3: {
        title: string
        description: string
      }
      saveMoney: string
      ecoFriendly: string
    }
    safetyHandling: {
      title: string
      subtitle: string
      safetyGuidelines: {
        title: string
        guideline1: string
        guideline2: string
        guideline3: string
        guideline4: string
      }
      properUsage: {
        title: string
        usage1: string
        usage2: string
        usage3: string
        usage4: string
      }
    }
    environmentalImpact: {
      title: string
      subtitle: string
      reducedWaste: {
        title: string
        description: string
      }
      circularEconomy: {
        title: string
        description: string
      }
      safeDisposal: {
        title: string
        description: string
      }
    }
    businessSolutions: {
      title: string
      subtitle: string
      restaurantsCafes: {
        title: string
        description: string
        feature1: string
        feature2: string
        feature3: string
        feature4: string
        getBusinessQuote: string
      }
      eventsCatering: {
        title: string
        description: string
        feature1: string
        feature2: string
        feature3: string
        feature4: string
        eventPlanning: string
      }
    }
  }

  // Contact
  contact: {
    title: string
    subtitle: string
    description: string
    phoneSupport: {
      title: string
      description: string
      hours: string
    }
    emailSupport: {
      title: string
      description: string
      response: string
    }
    officeLocation: {
      title: string
      description: string
      appointment: string
    }
    form: {
      title: string
      subtitle: string
      fullName: string
      email: string
      phone: string
      subject: string
      message: string
      sendMessage: string
      sending: string
      optional: string
      subjects: {
        general: string
        product: string
        support: string
        order: string
        refund: string
        other: string
      }
      placeholders: {
        fullName: string
        email: string
        phone: string
        subject: string
        message: string
      }
    }
    faq: {
      title: string
      subtitle: string
      questions: {
        q1: string
        a1: string
        q2: string
        a2: string
        q3: string
        a3: string
        q4: string
        a4: string
        q5: string
        a5: string
        q6: string
        a6: string
      }
    }
    liveChat: {
      title: string
      description: string
      startChat: string
    }
    offices: {
      title: string
      subtitle: string
      riyadh: {
        title: string
        address: string
        hours: string
        phone: string
      }
      jeddah: {
        title: string
        address: string
        hours: string
        phone: string
      }
    }
    testimonials: {
      title: string
      subtitle: string
      testimonial1: {
        text: string
        author: string
        role: string
      }
      testimonial2: {
        text: string
        author: string
        role: string
      }
      testimonial3: {
        text: string
        author: string
        role: string
      }
    }
    loginToChat: string
    startLiveChat: string
  }

  // Profile
  profile: {
    hero: {
      title: string
      description: string
    }
    tabs: {
      profile: string
      orders: string
      security: string
    }
    personalInfo: {
      title: string
      description: string
      firstName: string
      lastName: string
      username: string
      email: string
      phone: string
      firstNamePlaceholder: string
      lastNamePlaceholder: string
      usernamePlaceholder: string
      emailPlaceholder: string
      phonePlaceholder: string
      memberSince: string
      lastLogin: string
      edit: string
      cancel: string
      save: string
      saving: string
    }
    orders: {
      title: string
      description: string
      noOrders: string
      noOrdersDescription: string
      startShopping: string
      orderNumber: string
      status: string
      total: string
      date: string
      items: string
      shippingAddress: string
      loading: string
    }
    security: {
      changePassword: {
        title: string
        description: string
        currentPassword: string
        newPassword: string
        confirmPassword: string
        currentPasswordPlaceholder: string
        newPasswordPlaceholder: string
        confirmPasswordPlaceholder: string
        update: string
        updating: string
      }
      accountActions: {
        title: string
        description: string
        signOut: string
      }
    }
    messages: {
      profileUpdated: string
      passwordChanged: string
      passwordsNotMatch: string
      passwordTooShort: string
      currentPasswordIncorrect: string
      loadingProfile: string
      failedToLoadOrders: string
      failedToUpdateProfile: string
      failedToChangePassword: string
    }
  }

  // Track Order (Waybill-based tracking)
  trackOrder: {
    headerTitle: string
    headerSubtitle: string
    form: {
      title: string
      waybillLabel: string
      placeholder: string
      placeholderShort: string
      help: string
      submit: string
      submitting: string
    }
    errors: {
      emptyWaybill: string
      shortWaybill: string
    }
    info: {
      email: { title: string; body: string }
      help: { title: string; body: string }
    }
    features: {
      title: string
      realtime: { title: string; body: string }
      history: { title: string; body: string }
      alerts: { title: string; body: string }
    }
    results: {
      waybill: string
      historyTitle: string
      noInfo: string
    }
    noResults: {
      title: string
      desc: string
      hint: string
    }
    help: {
      title: string
      cantFind: { title: string; body: string; buttonEmail: string }
      stillIssues: { title: string; body: string; buttonSupport: string }
    }
  }

  // Blog & News
  blog: {
    hero: {
      title: string
      subtitle: string
      description: string
    }
    featuredPost: {
      title: string
      readMore: string
      publishedOn: string
      author: string
      category: string
    }
    categories: {
      all: string
      news: string
      tips: string
      recipes: string
      company: string
      science: string
      guide: string
      products: string
      environment: string
      health: string
      lifestyle: string
    }
    search: {
      placeholder: string
      searchButton: string
    }
    newsletter: {
      title: string
      description: string
      emailPlaceholder: string
      subscribe: string
    }
    pagination: {
      previous: string
      next: string
      page: string
      of: string
    }
    blogPosts: {
      readTime: string
      publishedOn: string
      author: string
      category: string
      backToBlog: string
      shareThisPost: string
      relatedPosts: string
      tags: string
      comments: string
      leaveComment: string
      commentPlaceholder: string
      postComment: string
      likePost: string
      likedPost: string
      // Blog post content translations
      postTitles: {
        post1: string
        post2: string
        post3: string
        post4: string
        post5: string
        post6: string
        post7: string
      }
      postExcerpts: {
        post1: string
        post2: string
        post3: string
        post4: string
        post5: string
        post6: string
        post7: string
      }
      postAuthors: {
        drinkmateTeam: string
        ahmedHassan: string
        sarahJohnson: string
        environmentalTeam: string
      }
      postDates: {
        jan15: string
        jan12: string
        jan10: string
        jan8: string
        jan5: string
        jan3: string
        dec30: string
      }
      post1: {
        title: string
        subtitle: string
        intro: string
        whyMake: {
          title: string
          health: {
            title: string
            benefit1: string
            benefit2: string
            benefit3: string
            benefit4: string
          }
          cost: {
            title: string
            saving1: string
            saving2: string
            saving3: string
            saving4: string
          }
        }
        excerpt: string
        author: string
        date: string
        tags: {
          recipes: string
          summer: string
          refreshing: string
          healthy: string
          sparkling: string
        }
      }
      post2: {
        title: string
        content: string
        excerpt: string
        author: string
        date: string
        tags: {
          science: string
          chemistry: string
          carbonation: string
          technology: string
        }
      }
      post3: {
        title: string
        content: string
        excerpt: string
        author: string
        date: string
        tags: {
          guide: string
          co2: string
          equipment: string
          tips: string
        }
      }
      post4: {
        title: string
        content: string
        excerpt: string
        author: string
        date: string
        tags: {
          products: string
          italian: string
          syrups: string
          premium: string
        }
      }
      post5: {
        title: string
        content: string
        excerpt: string
        author: string
        date: string
        tags: {
          environment: string
          plastic: string
          sustainability: string
          green: string
        }
      }
      post6: {
        title: string
        content: string
        excerpt: string
        author: string
        date: string
        tags: {
          health: string
          benefits: string
          myths: string
          science: string
        }
      }
      post7: {
        title: string
        content: string
        excerpt: string
        author: string
        date: string
        tags: {
          party: string
          entertainment: string
          social: string
          lifestyle: string
          carbonation: string
        }
      }
      authorBio: {
        team: string
        expert: string
      }
    }

  }

  // Privacy Policy
  privacyPolicy: {
    hero: {
      title: string
      subtitle: string
      lastUpdated: string
    }
    sections: {
      introduction: {
        title: string
        p1: string
        p2: string
        p3: string
      }
      dataCollection: {
        title: string
        intro: string
        items: string[]
        note: string
      }
      limitsOnUse: {
        title: string
        intro: string
        items: string[]
      }
      dataSharing: {
        title: string
        intro: string
        items: string[]
      }
      dataStorage: {
        title: string
        p1: string
      }
      dataProtection: {
        title: string
        intro: string
        items: string[]
        note: string
      }
      compliance: {
        title: string
        p1: string
      }
      yourResponsibilities: {
        title: string
        p1: string
        p2: string
      }
      thirdPartyLinks: {
        title: string
        p1: string
        p2: string
        p3: string
        p4: string
      }
      childrenPrivacy: {
        title: string
        p1: string
        p2: string
      }
      modifications: {
        title: string
        p1: string
        p2: string
        p3: string
      }
      contactUs: {
        title: string
        intro: string
        emailLabel: string
        phoneLabel: string
        email: string
        phone: string
        acknowledgment: string
        rightsReserved: string
      }
    }
  }

  // Terms of Service
  termsOfService: {
    hero: {
      title: string
      subtitle: string
      lastUpdated: string
    }
    sections: {
      acceptance: {
        title: string
        description: string
      }
      services: {
        title: string
        description: string
        included: string[]
      }
      userObligations: {
        title: string
        description: string
        obligations: string[]
      }
      payment: {
        title: string
        description: string
        terms: string[]
      }
      shipping: {
        title: string
        description: string
        policies: string[]
      }
      returns: {
        title: string
        description: string
        policy: string[]
      }
      warranty: {
        title: string
        description: string
        coverage: string[]
      }
      liability: {
        title: string
        description: string
        limitations: string[]
      }
      termination: {
        title: string
        description: string
        conditions: string[]
      }
      contact: {
        title: string
        description: string
        email: string
        phone: string
      }
      servicesDetails: {
        productSales: string
        co2Services: string
        customerSupport: string
        onlineOrdering: string
      }
      obligationsDetails: {
        accurateInfo: string
        safeUsage: string
        intellectualProperty: string
        accountSecurity: string
      }
      paymentDetails: {
        sarPrices: string
        paymentMethods: string
        orderProcessing: string
        refundTiming: string
      }
      shippingDetails: {
        freeShipping: string
        standardDelivery: string
        expressDelivery: string
        localPickup: string
      }
      returnsDetails: {
        originalCondition: string
        freeReturn: string
        fullRefund: string
        co2NotEligible: string
      }
      warrantyDetails: {
        sodaMakerWarranty: string
        accessoriesWarranty: string
        manufacturingDefects: string
        normalWear: string
      }
      liabilityDetails: {
        maxLiability: string
        noIndirectDamages: string
        noMisuseLiability: string
        forceMajeure: string
      }
      terminationDetails: {
        termsViolation: string
        fraudulentActivities: string
        nonPayment: string
        serviceAbuse: string
      }
      address: string
    }
  }

  // Exchange and Return Policy (Terms and Conditions)
  exchangeAndReturnPolicy: {
    hero: {
      title: string
      subtitle: string
      lastUpdated: string
    }
    sections: {
      introduction: { title: string; p1: string; p2: string; p3: string }
      definitions: { title: string; intro: string; items: string[] }
      legalLimits: { title: string; p1: string; p2: string; items: string[]; p3: string; p4: string; p5: string }
      legalCapacity: { title: string; p1: string; items: string[]; p2: string }
      membershipPolicy: { title: string; p1: string; items: string[]; p2: string; items2: string[] }
      purchasePolicy: { title: string; items: string[]; subItems: string[] }
      pricesAndTaxes: { title: string; items: string[] }
      paymentPolicy: { title: string; items: string[] }
      shippingPolicy: { title: string; items: string[] }
      cancellationAndReturns: { title: string; items: string[] }
      useLicenses: { title: string; p1: string; items: string[]; itemsNot: string[]; p2: string }
      securityProtection: { title: string; p1: string; items: string[] }
      intellectualProperty: { title: string; p1: string; p2: string; p3: string }
      disclaimer: { title: string; p1: string; p2: string; p3: string; p4: string; p5: string; items: string[]; p6: string; p7: string }
      compensation: { title: string; p1: string; p2: string }
      linksToSites: { title: string; p1: string; p2: string; p3: string }
      termAndTermination: { title: string; p1: string; p2: string; p3: string }
      transferOfRights: { title: string; p1: string; p2: string }
      applicableLaw: { title: string; p1: string; p2: string }
      modifications: { title: string; p1: string; p2: string; p3: string; p4: string }
      theLanguage: { title: string; p1: string }
      fullAgreement: { title: string; p1: string; p2: string }
      rightsReserved: string
    }
  }

  // Cookie Policy
  cookiePolicy: {
    hero: {
      title: string
      subtitle: string
      lastUpdated: string
    }
    sections: {
      whatAreCookies: {
        title: string
        description: string
      }
      howWeUseCookies: {
        title: string
        description: string
        purposes: string[]
      }
      typesOfCookies: {
        title: string
        essential: string
        analytics: string
        marketing: string
        preferences: string
      }
      managingCookies: {
        title: string
        description: string
        browser: string
        settings: string
      }
      thirdPartyCookies: {
        title: string
        description: string
        services: string[]
      }
      updates: {
        title: string
        description: string
      }
      contact: {
        title: string
        description: string
        email: string
      }
      purposesDetails: {
        rememberPreferences: string
        analyzeTraffic: string
        personalizedContent: string
        improveFunctionality: string
        ensureSecurity: string
      }
      thirdPartyServices: {
        googleAnalytics: string
        facebookPixel: string
        paymentProcessors: string
        socialMedia: string
      }
      address: string
    }
  }

  // Common
  common: {
    loading: string
    error: string
    success: string
    close: string
    next: string
    previous: string
    search: string
    filter: string
    clear: string
    apply: string
    cancel: string
    save: string
    changeToArabic: string
    changeToEnglish: string
    openMenu: string
    closeMenu: string
    edit: string
    delete: string
    view: string
    add: string
    remove: string
    quantity: string
    total: string
    subtotal: string
    shipping: string
    tax: string
    discount: string
    checkout: string
    continue: string
    back: string
    home: string
    about: string
    services: string
    blog: string
    privacy: string
    terms: string
    cookies: string
  }

  // Refill
  refill: {
    loadingTitle: string
    loadingSubtitle: string
    errorTitle: string
    retry: string
    carousel: { goTo: string }
    choose: { heading: string; subheading: string; needHelp: string; drinkmate: string; nonDrinkmate: string; brandPlaceholder: string; standardThreaded: string }
    qty: { title: string; subtitle: string; label: string; returnNote: string; deliveryInfo: string; deliveryTime: string; freeDeliveryNote: string; freeDeliveryNote2Plus: string; cylinder: string; emptyCylinders: string }
    discounts: { twoPlus: string; twoPlusLabel: string; threePlus: string; threePlusLabel: string; fourPlus: string; fourPlusLabel: string; active: string }
    offers: { heading: string; buy3FreeDelivery: string; buyXFreeDelivery: string; buy4PriceEach: string; addOneMoreForOffer: string; addMoreForFreeDelivery: string; returnNoteShort: string }
    cta: { addToCart: string; subscribe: string; premium: string }
    why: { title: string; f1: string; f2: string; f3: string; f4: string }
    summary: { unitPrice: string; subtotal: string; delivery: string; free: string; youSave: string; total: string; pickupNote: string; requiredReturn: string; deliveryTime: string; co2RefillExchange: string }
    tabs: { faqs: string; description: string; reviews: string; faqsTitle: string; faqsSubtitle: string; productDescription: string; keyFeatures: string; customerReviews: string }
    howItWorks: {
      step1: { title: string; description: string; label: string }
      step2: { title: string; description: string; label: string }
      step3: { title: string; description: string; label: string }
    }
    faqs: {
      q1: string
      a1: string
      q2: string
      a2: string
      q3: string
      a3: string
      q4: string
      a4: string
      q5: string
      a5: string
    }
    carouselDescription: { refill4: string }
  }

  // Account
  account: {
    loading: string
    loadingErrorTitle: string
    tryAgain: string
    errors: { notAuthenticated: string; failedLoad: string }
    welcome: string
    manageAccount: string
    stats: { orders: string; rating: string }
    profile: {
      title: string
      fullName: string
      phoneNumber: string
      phone: string
      email: string
      emailUnchangeable: string
      save: string
      cancel: string
      edit: string
    }
    address: {
      title: string
      district: string
      city: string
      country: string
      countryValue: string
      enterDistrict: string
      enterCity: string
      shortAddress: string
      nationalAddressLink: string
      optional: string
      placeholder: string
      formatHint: string
      save: string
      saving: string
      cancel: string
      viewLabel: string
      edit: string
    }
    password: {
      title: string
      current: string
      new: string
      confirm: string
      change: string
      cancel: string
      security: string
      strong: string
      lastUpdated: string
    }
    orders: { title: string; itemsSuffix: string; view: string; viewAll: string }
    toasts: {
      nameRequired: string
      loginFirst: string
      profileSaved: string
      profileSaveError: string
      addressValidation: string
      nationalAddressInvalid: string
      addressSaved: string
      addressSaveError: string
      passwordAllRequired: string
      passwordMismatch: string
      passwordTooShort: string
      passwordNotAuthenticated: string
      passwordChanged: string
      passwordChangeError: string
    }
  }

  // Cart
  cart: {
    title: string
    loading: string
    error: string
    retry: string
    empty: string
    emptyDescription: string
    continueShopping: string
    orderSummary: string
    taxesNote?: string
    coupon?: { enter: string; applied: string; invalid: string }
    removeItem: string
    updateQuantity: string
    subtotal: string
    shipping: string
    tax: string
    total: string
    vatIncluded: string
    freeShipping: string
    freeShippingThreshold: string
    checkout: string
    quantity: string
    price: string
    totalItems: string
  }

  // Checkout
  checkout: {
    title: string
    billingInformation: string
    shippingInformation: string
    paymentMethod: string
    orderSummary: string
    placeOrder: string
    processingPayment: string
    fullName: string
    email: string
    phone: string
    city: string
    district: string
    nationalAddress: string
    deliveryOptions: string
    standardDelivery: string
    expressDelivery: string
    orderNotes: string
    agreeToTerms: string
    shipToDifferent: string
    termsPrefix: string
    termsLink: string
    required: string
    optional: string
    shippingCost: string
    taxIncluded: string
    country: string
    deliveryInformation: string
    shippingAddress: string
    shortAddress: string
    shortAddressFormat: string
    featuredProducts: string
    quantity: string
    price: string
    couponCode: string
    apply: string
    discount: string
    currency: string
    tabby: {
      name: string
      tagline: string
      benefits: {
        noInterest: string
        noFees: string
        payLater: string
      }
    }
    newBadge: string
    privacyNote: string
    privacyPolicy: string
    guestNotice: string
    login: string
    guestSuffix: string
    loggedInAs: string
    validation: {
      fullNameRequired: string
      fullNameMinLength: string
      fullNameInvalid: string
      phoneRequired: string
      phoneInvalid: string
      phoneLength: string
      districtRequired: string
      districtMinLength: string
      cityRequired: string
      cityMinLength: string
      emailRequired: string
      emailInvalid: string
      nationalAddressLength: string
      nationalAddressFormat: string
      pleaseFixErrors: string
      agreeToTerms: string
    }
  }

  // Auth
  auth: {
    createAccount: string
    joinDrinkmate: string
    fullName: string
    email: string
    password: string
    confirmPassword: string
    agreeToTerms: string
    alreadyHaveAccount: string
    signIn: string
    dontHaveAccount: string
    signUp: string
    forgotPassword: string
    resetPassword: string
    passwordRequirements: string
    passwordMustContain: string
    atLeast8Characters: string
    oneUppercaseLetter: string
    oneLowercaseLetter: string
    oneNumber: string
    oneSpecialCharacter: string
    passwordsMustMatch: string
    termsAndConditions: string
    privacyPolicy: string
  }

  // Product
  product: {
    inStock: string
    outOfStock: string
    onlyLeftInStock: string
    stockCount: string
    addToCart: string
    buyNow: string
    addToWishlist: string
    removeFromWishlist: string
    share: string
    notifyMe: string
    writeReview: string
    askQuestion: string
    description: string
    specifications: string
    reviews: string
    freeShipping?: string
    featured?: string
    questions: string
    relatedProducts: string
    youMayAlsoLike: string
    frequentlyAskedQuestions: string
    customerReviews: string
    save: string
    goToCart: string
    quantity: string
    keyFeatures: string
    defaultFeature?: string
    defaultSafety1?: string
    defaultSafety2?: string
    badges?: {
      bestSeller: string
      new: string
      ecoFriendly: string
    }
    safetyQuality?: string
    estimatedDelivery?: string
    options?: string
    notifyWhenAvailable?: string
    loadingDetails?: string
    preparingExperience?: string
    technicalSpecifications: string
    allReviews: string
    allQuestions: string
    usageFeatures: string
    installationSetup: string
    warrantySupport: string
    sold: string
    reviewsCount: string
    questionsCount: string
    videos?: string
    qa?: string
    certifications?: string
    material?: string
    dimensions?: string
    weight?: string
    warranty?: string
    compatibility?: string
    notFoundTitle?: string
    notFoundDescription?: string
    backToShop?: string
    goBack?: string
    backToHome?: string
    backToAccessories?: string
    backToSodaMakers?: string
    premium?: string
    standard?: string
    lightweight?: string
    quickView?: string
    compareProducts?: string
    writeAReview: string
    askAQuestion: string
    submitReview: string
    submitQuestion: string
    rating: string
    helpful: string
    notHelpful: string
    report: string
    sortBy: string
    filterBy: string
    newest: string
    oldest: string
    highestRated: string
    lowestRated: string
    all: string
    verified: string
    recommended: string
    pros: string
    cons: string
    wouldRecommend: string
    yes: string
    no: string
  }

  // Footer
  footer: {
    companyDescription: string
    phone: string
    email: string
    address: string
    products: {
      title: string
      sodaMakers: string
      co2Cylinders: string
      italianSyrups: string
      accessories: string
      giftBundles: string
      bulkOrders: string
    }
    information: {
      title: string
      support: string
      reprintReturnLabel: string
      legalTerms: string
      privacyPolicy: string
      cookiePolicy: string
      drinkmateRecipe: string
      blogs: string
    }
    more: {
      title: string
      trackOrder: string
    }
    newsletter: {
      title: string
      emailPlaceholder: string
      subscribeButton: string
      disclaimer: string
    }
    social: {
      followUs: string
    }
    payment: {
      title: string
    }
    delivery: {
      title: string
    }
    copyright: string
  }

  // Recipes
  recipes: {
    hero: {
      title: string
      subtitle: string
      description: string
      exploreRecipes: string
      downloadPDF: string
      recipesCountNumber: string
      recipesLabel: string
    }
    featuredRecipe: {
      recipeOfTheWeek: string
      description: string
      prepTime: string
      difficulty: string
      ingredients: string
      instructions: string
      saveRecipe: string
      share: string
    }
    categories: {
      all: string
      fruity: string
      citrus: string
      berry: string
      cola: string
    }
    recipeData: {
      italianStrawberryLemonade: {
        name: string
        category: string
        difficulty: string
        time: string
        instructions: string
      }
      cherryColaFizz: {
        name: string
        category: string
        difficulty: string
        time: string
        instructions: string
      }
      blueRaspberryBlast: {
        name: string
        category: string
        difficulty: string
        time: string
        instructions: string
      }
      limeMojitoSparkle: {
        name: string
        category: string
        difficulty: string
        time: string
        instructions: string
      }
      orangeCreamsicle: {
        name: string
        category: string
        difficulty: string
        time: string
        instructions: string
      }
      grapeSodaSupreme: {
        name: string
        category: string
        difficulty: string
        time: string
        instructions: string
      }
    }
    ingredients: {
      strawberryLemonSyrup: string
      cherryColaSyrup: string
      blueRaspberrySyrup: string
      limeSyrup: string
      orangeSyrup: string
      vanillaSyrup: string
      grapeSyrup: string
      sparklingWater: string
      freshLemon: string
      freshBlueberries: string
      mint: string
      mintLeaves: string
      sugar: string
      cream: string
      ice: string
    }
    tags: {
      refreshing: string
      summer: string
      popular: string
      classic: string
      bold: string
      fizzy: string
      berry: string
      gourmet: string
      citrus: string
      mojito: string
      fresh: string
      creamy: string
      orange: string
      dessert: string
      grape: string
      simple: string
    }
    allRecipes: {
      title: string
      description: string
    }
    recipeCard: {
      reviews: string
      ingredients: string
      viewRecipe: string
    }
    newsletter: {
      title: string
      description: string
      emailPlaceholder: string
      subscribe: string
    }
    difficultyLevels: {
      title: string
      subtitle: string
      beginner: {
        title: string
        description: string
        feature1: string
        feature2: string
        feature3: string
      }
      intermediate: {
        title: string
        description: string
        feature1: string
        feature2: string
        feature3: string
      }
      advanced: {
        title: string
        description: string
        feature1: string
        feature2: string
        feature3: string
      }
    }
    seasonalRecipes: {
      title: string
      subtitle: string
      spring: {
        title: string
        description: string
      }
      summer: {
        title: string
        description: string
      }
      autumn: {
        title: string
        description: string
      }
      winter: {
        title: string
        description: string
      }
    }
    communityRecipes: {
      title: string
      subtitle: string
      tropicalParadise: {
        title: string
        description: string
        by: string
        verified: string
      }
      berryBlast: {
        title: string
        description: string
        by: string
        verified: string
      }
      submitYourRecipe: string
    }
    nutritionalInfo: {
      title: string
      subtitle: string
      calorieUnit: string
      calorieContent: {
        title: string
        plainSparklingWater: string
        withNaturalSyrup: string
        premiumSyrupMix: string
      }
      healthBenefits: {
        title: string
        benefit1: string
        benefit2: string
        benefit3: string
      }
      allergenInfo: {
        title: string
        info1: string
        info2: string
        info3: string
      }
    }
  }
}

export const translations: Record<Language, Translations> = {
  EN: {
    header: {
      home: "Home",
      shop: "Shop",
      sodamakers: "Sodamakers",
      flavor: "Flavor",
      accessories: "Accessories",
      co2: "CO2",
      recipes: "Recipes",
      contactUs: "Contact Us",
      offers: "Offers",
      trackOrder: "Track Order",
      userMenu: "User Menu",
      refillCylinder: "Refill Cylinder",
      refill: "Refill"
    },
    trackOrder: {
      headerTitle: "Track Your Order",
      headerSubtitle: "Enter your Aramex waybill number to get real-time tracking information",
      form: {
        title: "Track Shipment",
        waybillLabel: "Waybill Number",
        placeholder: "Enter your waybill number (e.g., 1234567890)",
        placeholderShort: "Enter your waybill number",
        help: "You can find your waybill number in the shipping confirmation email",
        submit: "Track Order",
        submitting: "Tracking..."
      },
      errors: {
        emptyWaybill: "Please enter a waybill number",
        shortWaybill: "Waybill number must be at least 8 characters long"
      },
      info: {
        email: {
          title: "Check Your Email",
          body: "Your waybill number was sent to your email address when your order was shipped. Check your inbox and spam folder."
        },
        help: {
          title: "Need Help?",
          body: "Can't find your waybill number? Contact our support team and we'll help you track your order."
        }
      },
      features: {
        title: "What You Can Track",
        realtime: { title: "Real-time Status", body: "Get live updates on your package location and delivery status" },
        history: { title: "Detailed History", body: "View complete tracking history with timestamps and locations" },
        alerts: { title: "Delivery Alerts", body: "Get notified about any delivery issues or exceptions" }
      },
      results: {
        waybill: "Waybill",
        historyTitle: "Tracking History",
        noInfo: "No tracking information available yet."
      },
      noResults: {
        title: "No Tracking Information Found",
        desc: "We couldn't find any tracking information for waybill number:",
        hint: "Please check the waybill number and try again, or contact our support team."
      },
      help: {
        title: "Need Help?",
        cantFind: {
          title: "Can't find your waybill number?",
          body: "Your waybill number was sent to your email when your order was shipped. Check your inbox or spam folder.",
          buttonEmail: "Check Email"
        },
        stillIssues: {
          title: "Still having issues?",
          body: "Our support team is here to help you track your order.",
          buttonSupport: "Contact Support"
        }
      }
    },
    account: {
      loading: "Loading account data...",
      loadingErrorTitle: "Loading Error",
      tryAgain: "Try Again",
      errors: {
        notAuthenticated: "Not authenticated",
        failedLoad: "Failed to load account data"
      },
      welcome: "Welcome",
      manageAccount: "Manage your account and orders",
      stats: { orders: "Orders", rating: "Rating" },
      profile: {
        title: "Profile Information",
        fullName: "Full Name",
        phoneNumber: "Phone Number",
        phone: "Phone",
        email: "Email",
        emailUnchangeable: "Email cannot be changed",
        save: "Save Changes",
        cancel: "Cancel",
        edit: "Edit"
      },
      address: {
        title: "Address",
        district: "District",
        city: "City",
        country: "Country",
        countryValue: "Saudi Arabia",
        enterDistrict: "Enter district",
        enterCity: "Enter city",
        shortAddress: "Short Address",
        nationalAddressLink: "National Address",
        optional: "(optional)",
        placeholder: "JESA3591",
        formatHint: "Format: 4 letters followed by 4 numbers (e.g., JESA3591)",
        save: "Save Address",
        saving: "Saving...",
        cancel: "Cancel",
        viewLabel: "Address",
        edit: "Edit"
      },
      password: {
        title: "Change Password",
        current: "Current Password",
        new: "New Password",
        confirm: "Confirm Password",
        change: "Change Password",
        cancel: "Cancel",
        security: "Account Security",
        strong: "Strong Password",
        lastUpdated: "Last updated: 1 month ago"
      },
      orders: {
        title: "Orders & Returns",
        itemsSuffix: "items",
        view: "View",
        viewAll: "View All Orders"
      },
      toasts: {
        nameRequired: "Please fill in full name",
        loginFirst: "Please log in first",
        profileSaved: "Profile saved successfully!",
        profileSaveError: "Error saving profile",
        addressValidation: "Please fill in district and city",
        nationalAddressInvalid: "Format must be: 4 letters followed by 4 numbers (e.g., JESA3591)",
        addressSaved: "Address saved successfully!",
        addressSaveError: "Error saving address",
        passwordAllRequired: "All fields are required",
        passwordMismatch: "New passwords do not match",
        passwordTooShort: "Password must be at least 8 characters",
        passwordNotAuthenticated: "Not authenticated",
        passwordChanged: "Password changed successfully",
        passwordChangeError: "Error changing password"
      }
    },
    banner: {
      messages: {
        freeDelivery: "🚚 Free delivery on orders above 150 ﷼",
        colaFlavors: "🥤 Get 3 cola flavors just for 149 ﷼ use code COLA44",
        firstOrderDiscount: "🎉 Get 5% off on your first order with us code NEW25",
        megaOffer: "⚡ Drinkmate OmniFizz starting from 599 ﷼",
        cylinderRefill: "🔄 CO2 cylinder refill from 65 ﷼"
      },
      codes: {
        cola44: "Cola44",
        new25: "NEW25"
      }
    },
    banners: {
      premiumItalianSyrups: { title: "PREMIUM ITALIAN SYRUPS", subtitle: "100% NATURAL | NO ADDED SUGAR" },
      colaBundle: "COLA BUNDLE",
      easyRefill: "Easy Refill | Seamless Exchange"
    },
    home: {
      hero: {
        title: "Sparkling Made Simple",
        subtitle: "With Drinkmate OmniFizz",
        description: "Enjoy free Italian strawberry lime with the purchase of Arctic blue color machine.",
        exploreMore: "Explore more",
        buyNow: "Buy Now"
      },
      refill: {
        title: "SHOP MORE. SAVE MORE.",
        description: "Now refill 4 cylinders all together for the price of 55 each cylinder.",
        buttonText: "Shop Now",
        offerText: "*Offer valid for whole year*",
        carbonatesUpto: "Carbonates upto",
        liters: "60",
        litersOfDrink: "Liters of drink",
        slide2: {
          headline: "GET ENERGY DRINK & COLA FLAVOR FOR 79",
          description: "Beat the summer heat with our best sellers.",
          buttonText: "Shop Now"
        },
        slide3: {
          headline: "5% OFF ON FIRST ORDER FOR OUR NEW CUSTOMERS",
          description: "Getting into sparkle game? Enjoy 5% off on your first order with drinkmate.",
          buttonText: "Shop Now"
        }
      },
      features: {
        title: "Why Choose Drinkmate",
        subtitle: "Premium quality meets innovative technology",
        feature1: {
          title: "Versatile Carbonation",
          description: "Carbonate any liquid including juice, wine, and cocktails"
        },
        feature2: {
          title: "Italian Flavors",
          description: "Authentic Italian syrups made with natural ingredients"
        },
        feature3: {
          title: "Eco-Friendly",
          description: "Reduce plastic waste with reusable bottles"
        }
      },
      products: {
        title: "Featured Products",
        subtitle: "Discover our best-selling items",
        viewAll: "View All"
      },
      testimonials: {
        title: "What Our Customers Say",
        subtitle: "Real feedback from satisfied customers",
        testimonial1: {
          text: "Excellent customer service! The team helped me choose the perfect soda maker and the support has been outstanding.",
          author: "Ahmed S.",
          role: "Verified Customer"
        },
        testimonial2: {
          text: "Quick response time and very helpful staff. They resolved my CO2 refill issue within hours.",
          author: "Sarah M.",
          role: "Verified Customer"
        },
        testimonial3: {
          text: "Professional service and great product knowledge. They really know their stuff!",
          author: "Mohammed K.",
          role: "Verified Customer"
        }
      },
      carousel: {
        slide1: {
          headline: "REFILL MORE. SAVE MORE.",
          description: "Now refill 4 cylinders all together for the price of 55 each cylinder.",
          buttonText: "Shop Now",
          offerText: "*Offer valid for whole year*",
          carbonatesUpto: "Carbonates upto",
          liters: "60",
          litersOfDrink: "Liters of drink"
        },
        slide2: {
          headline: "GET ENERGY DRINK & COLA FLAVOR FOR 79",
          description: "Beat the summer heat with our best sellers.",
          buttonText: "Shop Now"
        },
        slide3: {
          headline: "5% OFF ON FIRST ORDER FOR OUR NEW CUSTOMERS",
          description: "Getting into sparkle game? Enjoy 5% off on your first order with drinkmate.",
          buttonText: "Shop Now"
        }
      },
      productCategories: {
        title: "Our Product Categories",
        sodaMakers: "Soda Makers",
        co2: "CO2",
        premiumItalianFlavors: "Premium Italian Flavors",
        accessories: "Accessories"
      },
      megaOffer: {
        title: "Drinkmate OmniFizz",
        description: "Unlike traditional soda makers, the Drinkmate OmniFizz allows you to effortlessly carbonate any drink, from juice and iced tea to wine and cocktails, providing endless possibilities for sparkling refreshments.",
        availableColors: "Available Color Options",
        offersBundles: "Bundles",
        exploreMore: "Explore More"
      },
      howItWorks: {
        title: "How does the Drinkmate OmniFizz work?",
        subtitle: "Four simple steps that show you how to use the Drinkmate OmniFizz",
        description: "Four simple steps that show you how to use the Drinkmate OmniFizz",
        steps: {
          step1: {
            title: "Fill",
            description: "Fill the bottle with your desired beverage.",
            alt: "Step 1: Fill Bottle"
          },
          step2: {
            title: "Fizz",
            description: "Press the button to carbonate your drink.",
            alt: "Step 2: Carbonate Drink"
          },
          step3: {
            title: "Flip",
            description: "Open the valve on the Fizz Infuser to release the pressure.",
            alt: "Step 3: Flip to Release Pressure"
          },
          step4: {
            title: "Enjoy!",
            description: "Fill into a glass and enjoy the drink.",
            alt: "Step 4: Enjoy Drink"
          }
        }
      },
      co2Section: {
        title: "Why CO₂?",
        litersOfDrinks: "Liters of Drinks",
        description: "CO₂ gas adds bubbles and fizz to your water. Our Food Grade CO₂ ensures safe, fresh, and sparkling drinks every time.",
        descriptionAr: "مع برنامج تبادل ثاني أكسيد الكربون من Drinkmate، أرسل الأسطوانات الفارغة واحصل على خصم على مشترياتك القادمة من ثاني أكسيد الكربون. سهل ومستدام وجاهز للفوران—دائماً.",
        learnMore: "Learn More",
        learnMoreAr: "اعرف المزيد",
        ShopNow: "Shop Now",
        ShopNowAr: "تسوق الآن",
        exploreSubscriptions: "Explore Subscriptions",
        exploreSubscriptionsAr: "استكشف الاشتراكات",
        benefits: {
          easyExchange: "Easy cylinder exchange",
          easyExchangeAr: "تبادل سهل للأسطوانات",
          sustainable: "Sustainable & eco-friendly",
          sustainableAr: "مستدام وصديق للبيئة",
          fizzReady: "Always fizz-ready",
          fizzReadyAr: "دائماً جاهز للفوران"
        }
      },
      flavorSection: {
        subtitle: "Don't just sparkle water",
        title: "Sparkle Anything",
        description: "Discover our premium Italian flavors and create amazing sparkling drinks at home. From classic cola to exotic fruit combinations, the possibilities are endless!",
        exploreFlavors: "Explore Flavors"
      },
      additionalSections: {
        howToUse: {
          title: "How to Use",
          description: "Learn how to make perfect drinks every-time using drinkmate's premium Italian syrups."
        },
        recipes: {
          title: "Recipes",
          description: "DIY drinks custom made for you to experience and enjoy."
        },
        premiumFlavors: {
          title: "Premium Italian Flavors",
          description: "Know & try all 22 of our natural no sugar premium Italian flavors."
        }
      },
      environmental: {
        subtitle: "Know More About Drinkmate Efforts For The",
        title: "Greener & Better Environment",
        plasticImpact: "Our impact on One time plastic use",
        naturalFlavors: "How our natural flavors are made",
        healthBenefits: "Health Benefits of sparkling water"
      }
    },
    cylinders: {
      banner: {
        title: "Exchange CO₂ / REFILL CO₂",
        subtitle: "Fast, reliable CO₂ exchange and refill so your sparkle never stops."
      },
      cardNew: {
        title: "New / Spare Cylinder",
        description: "Keep a spare cylinder on hand so you never run out of sparkling drinks. Buy a new cylinder for just 175.00 SAR",
        shopNow: "Shop Now",
        imageAlt: "New Drinkmate CO2 cylinders"
      },
      cardRefill: {
        title: "Refill / Exchange Cylinder",
        description: "Bring your empty cylinder and receive a full one at the cost of the refill only, it only starts from",
        shopNow: "Shop Now",
        imageAlt: "Refill or exchange CO2 cylinder"
      },
      effortless: {
        title: "Effortless sparkling with Drinkmate CO₂",
        quickRefill: "Quick, hassle-free cylinder refills and exchanges",
        spareCylinder: "Keep a spare cylinder to never run out of sparkle",
        foodGrade: "Food-grade CO₂ for safe, consistent carbonation",
        ecoFriendly: "Eco-friendly cylinder exchanges reduce waste"
      },
      exchangeBanner: {
        title: "Exchange Made Simple",
        description: "Swap your empty CO₂ cylinder for a freshly filled one. Pay only for the refill and keep your sparkling drinks uninterrupted.",
        shopNow: "Shop now",
        imageAlt: "Exchange empty for full CO2 cylinders"
      }
    },
    shop: {
      title: "Shop Our Products",
      subtitle: "Premium soda makers and authentic Italian flavors",
      description: "Discover our complete range of soda makers, CO2 cylinders, premium Italian syrups, and accessories. Everything you need to create perfect sparkling drinks at home.",
      co2BannerHeading: "Where the frizz begin",
      hero: {
        title: "Shop Our",
        subtitle: "Products",
        description: "Discover our complete range of soda makers, CO2 cylinders, premium Italian syrups, and accessories. Everything you need to create perfect sparkling drinks at home."
      },
      refill: {
        title: "REFILL MORE. SAVE MORE.",
        description: "Now refill 4 cylinders all together for the price of 55 {SAR_SYMBOL} each cylinder.",
        buttonText: "Refill Now",
        offerText: "*Offer valid for whole year*",
        carbonatesUpto: "Carbonates upto",
        liters: "60",
        litersOfDrink: "Liters of drink",
        slide2: {
          headline: "GET ENERGY DRINK & COLA FLAVOR FOR 79 {SAR_SYMBOL}",
          description: "Beat the summer heat with our best sellers.",
          buttonText: "Shop Now"
        },
        slide3: {
          headline: "5% OFF ON FIRST ORDER FOR OUR NEW CUSTOMERS",
          description: "Getting into sparkle game? Enjoy 5% off on your first order with drinkmate.",
          buttonText: "Shop Now"
        }
      },
      bundles: {
        title: "Premium",
        subtitle: "Bundles",
        description: "Discover our carefully curated bundles designed to give you the ultimate Drinkmate experience. Save big while getting everything you need in one perfect package.",
        starterKit: "Starter Kit",
        familyPack: "Family Pack",
        premiumBundle: "Premium Bundle",
        starterKitDescription: "Everything you need to get started with Drinkmate.",
        familyPackDescription: "Perfect for families looking to carbonate their drinks.",
        premiumBundleDescription: "The ultimate Drinkmate experience, all in one bundle.",
        starterKitItems: "1 Drinkmate OmniFizz, 1 CO2 Cylinder, 1 Strawberry Lemon Syrup Bottle",
        familyPackItems: "2 Drinkmate OmniFizz, 2 CO2 Cylinders, 2 Premium Flavors Pack, 1 Bottles Set",
        premiumBundleItems: "3 Drinkmate OmniFizz, 3 CO2 Cylinders, 3 Premium Flavors Pack, 1 Bottles Set, 1 Energy Cola Flavors Pack",
        includes: "INCLUDES:",
        save: "Save",
        shopNow: "Shop Now",
        getPopularBundle: "🔥 Get Popular Bundle",
        limitedTimeOffer: "⚡ LIMITED TIME OFFER",
        bestSeller: "🔥 BEST SELLER",
        mostPopular: "⭐ MOST POPULAR",
        limitedTimeOfferText: "Limited Time Offer"
      },
      filters: {
        all: "All",
        machines: "Soda Makers",
        flavors: "Italian Flavors",
        accessories: "Accessories",
        showing: "Showing",
        products: "products",
        sortBy: "Sort by:",
        featured: "Featured",
        priceLowToHigh: "Price: Low to High",
        priceHighToLow: "Price: High to Low",
        highestRated: "Highest Rated",
        newest: "Newest",
        loadMore: "Load More Products",
        quickStats: "Quick Stats",
        totalProducts: "Total Products",
        categories: "Categories",
        brands: "Brands",
        inStock: "In Stock",
        filters: "Filters",
        priceRange: "Price Range",
        minPrice: "Min Price",
        maxPrice: "Max Price",
        customerRating: "Customer Rating",
        availability: "Availability",
        specialOffers: "Special Offers",
        allCategories: "All Categories",
        inStockOnly: "In Stock Only",
        newProducts: "New Products",
        bestSellers: "Best Sellers",
        onSale: "On Sale",
        clearAll: "Clear all",
        showResults: "Show Results",
        productsFound: "products found"
      },
      search: {
        placeholder: "Search products, brands, or categories...",
        helpText: "Search for products by name, brand, or category. Results will update as you type.",
        searchingFor: "Searching for",
        results: "result",
        clearSearch: "Clear search"
      },
      sort: {
        mostPopular: "Most Popular",
        priceLowToHigh: "Price: Low to High",
        priceHighToLow: "Price: High to Low",
        newestFirst: "Newest First",
        highestRated: "Highest Rated",
        helpText: "Choose how to sort the products. Options include popularity, price, newest, and rating."
      },
      pagination: {
        previous: "Previous",
        next: "Next"
      },
      contact: {
        hero: { title: "Get in Touch", subtitle: "We're here to help. Choose the best way to reach us." },
        options: {
          heading: "Contact Options",
          whatsapp: { title: "WhatsApp", availability: "Typical replies 9–5", button: "Chat on WhatsApp" },
          email: { title: "Email", availability: "We reply within 1 business day", button: "Email support@drinkmates.com" },
          chat: {
            title: "Live Chat",
            checking: "Checking availability...",
            loginRequired: "Login required to start chat",
            avgReply: "Avg. reply ~2 min",
            opensAt: "Opens",
            buttonLoading: "Loading...",
            buttonLogin: "Login to chat",
            buttonStart: "Start live chat"
          },
          show: "Show",
          hide: "Hide"
        },
        status: { available: "Live now", offline: "Offline", always: "24/7", loginRequired: "Login required" },
        form: {
          title: "Contact Form",
          subtitle: "Send us a message anytime.",
          reason: "Reason for contact",
          reasons: {
            general: "General Inquiry",
            order: "Order Related",
            billing: "Billing Question",
            technical: "Technical Support",
            refund: "Refund Request",
            other: "Other"
          },
          name: "Full name *",
          namePlaceholder: "Enter your full name",
          nameRequired: "Name is required",
          email: "Email *",
          emailPlaceholder: "Enter your email",
          emailRequired: "Valid email is required",
          phone: "Phone (optional)",
          phoneHint: "For faster follow-up",
          message: "Message *",
          messagePlaceholder: "Tell us how we can help you...",
          messageMin: "Minimum 10 characters",
          attachments: "Attachments (optional)",
          uploadBtn: "Upload up to 3 files / 10MB total",
          uploadHint: "(JPG, PNG, GIF, PDF)",
          consent: "I agree to the privacy policy and terms of service",
          submit: "Send message",
          submitting: "Sending...",
          errors: {
            fillAll: "Please fill in all required fields",
            consent: "Please agree to the privacy policy and terms of service",
            maxFiles: "Maximum 3 files allowed",
            fileTooLarge: "File too large. Maximum 10MB allowed.",
            invalidType: "Invalid file type. Only JPG, PNG, GIF, and PDF allowed.",
            submitFail: "Failed to send message"
          },
          success: {
            heading: "We've received your message — ticket DM-",
            subtitle: "We'll reply within 1 business day. A confirmation email has been sent.",
            another: "Send Another Message"
          },
          history: {
            title: "Your Previous Messages & Responses",
            yourMessage: "Your message:",
            ourResponse: "Our response:"
          }
        },
        faq: {
          heading: "Frequently Asked Questions",
          searchPlaceholder: "Search our FAQ…",
          cta: "Didn't find what you need?",
          categories: {
            orders: "Orders & Delivery",
            refill: "Refill & Exchange",
            returns: "Returns & Warranty",
            payment: "Payment & Billing"
          },
          viewAll: "View all {{count}} questions →",
          emailSubject: "FAQ Question",
          emailBody: "I couldn't find the answer to my question in the FAQ. Here's what I need help with:\n\n"
        },
        map: {
          visit: "Visit Our Office",
          seeUs: "Come and see us in person",
          officeInfo: "Office Information",
          address: "Address",
          businessHours: "Business Hours",
          phone: "Phone",
          getDirections: "Get Directions",
          googleMaps: "Google Maps",
          appleMaps: "Apple Maps",
          city: "As Salamah, Jeddah",
          country: "Saudi Arabia"
        }
      },
      categoryPages: {
        explorePremium: "Explore Our Premium",
        loadingProducts: "Loading premium products...",
        failedToLoad: "Failed to load products. Please try again later.",
        noProductsFound: "No products found in this category.",
        checkBackLater: "Please check back later or try a different category.",
        errorLoading: "Error Loading Products",
        activeFilters: "Active filters:",
        tryAgain: "Try Again",
        filterApplied: "filter applied",
        filtersApplied: "filters applied",
        trySearchingFor: "Try searching for:",
        shopByCategory: "Shop by Category",
        discoverCollection: "Discover our premium collection of soda makers, flavors, and accessories",
        shopAllProducts: "Shop All Products",
        omnifizzTitle: "OmniFizz Soda Makers",
        omnifizzDescription: "Premium carbonation for all beverages",
        luxeTitle: "LUX Soda Makers",
        luxeDescription: "Luxurious and elegant carbonation experience",
        sodamakers: {
          title: "Explore Our Premium Soda Makers"
        },
        flavors: {
          title: "Explore Our Premium Flavors"
        },
        accessories: {
          title: "Explore Our Premium Accessories"
        },
        co2: {
          title: "Explore Our CO2 Cylinders"
        }
      },
      products: {
        addToCart: "ADD TO CART",
        selectOptions: "Select Options",
        outOfStock: "OUT OF STOCK",
        new: "🆕 NEW",
        popular: "⭐ POPULAR",
        discount: "💥",
        verified: "Verified",
        reviews: "reviews",
        rating: "rating",
        productNames: {
          drinkmateRed: "Drinkmate - OmniFizz Machine - Red",
          drinkmateBlue: "Drinkmate - OmniFizz Machine - Blue",
          drinkmateBlack: "Drinkmate - OmniFizz Machine - Black",
          co2Cylinder: "CO2 Cylinder 60L",
          strawberryLemonSyrup: "Italian Strawberry Lemon Syrup",
          premiumFlavorsPack: "Premium Italian Flavors Pack",
          bottlesSet: "Drinkmate Bottles Set",
          energyColaFlavors: "Energy Cola Flavors"
        },
        categories: {
          sodaMakers: "Soda Makers",
          co2: "CO2",
          italianFlavors: "Italian Flavors",
          accessories: "Accessories"
        }
      },

      customerReviews: {
        title: "What Our",
        subtitle: "Customers",
        description: "Real reviews from satisfied Drinkmate users worldwide",
        joinCustomers: "Join 10,000+ Happy Customers",
        experienceDifference: "Experience the Drinkmate difference today!",
        verified: "Verified",
        reviews: {
          sarah: {
            name: "Sarah Al-Mansouri",
            location: "Riyadh, Saudi Arabia",
            review: "Absolutely love my Drinkmate OmniFizz! The Italian flavors are incredible and the machine is so easy to use. My kids love making their own sparkling drinks. Best purchase ever!",
            date: "2 weeks ago"
          },
          ahmed: {
            name: "Ahmed Hassan",
            location: "Jeddah, Saudi Arabia",
            review: "Perfect for hosting parties! Everyone is amazed by the quality of sparkling drinks we can make at home. The CO2 exchange program is very convenient and cost-effective.",
            date: "1 month ago"
          },
          fatima: {
            name: "Fatima Zahra",
            location: "Dammam, Saudi Arabia",
            review: "The premium Italian flavors are absolutely divine! I've tried all 22 flavors and each one is better than the last. The machine is durable and the customer service is exceptional.",
            date: "3 weeks ago"
          },
          omar: {
            name: "Omar Khalil",
            location: "Abha, Saudi Arabia",
            review: "Great investment for health-conscious people. We've reduced our soda consumption significantly and now enjoy natural sparkling drinks. The starter kit was perfect for beginners.",
            date: "1 month ago"
          },
          layla: {
            name: "Layla Al-Rashid",
            location: "Tabuk, Saudi Arabia",
            review: "The family pack bundle is amazing value! We use it daily and the quality never disappoints. The machine is built to last and the flavors are restaurant-quality. Highly recommend!",
            date: "2 months ago"
          },
          youssef: {
            name: "Youssef Al-Mahmoud",
            location: "Al-Khobar, Saudi Arabia",
            review: "Excellent product and service! The CO2 cylinders last longer than expected and the flavors are authentic Italian. Perfect for making mocktails and refreshing drinks at home.",
            date: "3 weeks ago"
          }
        }
      },
      promotional: {
        limitedTimeOffer: "Limited Time Offer",
        saveUpTo: "Save up to",
        selectedItems: "on selected items",
        dontMissOut: "Don't miss out on these amazing deals - shop now before they're gone!",
        shopDeals: "🚀 Shop the Deals",
        shopNow: "Shop Now",
        limitedTimeOfferText: "Limited Time Offer"
      },
      productDetail: {
        breadcrumb: {
          shop: "Shop",
          category: "Product Category",
          product: "Product Name"
        },
        badges: {
          new: "New",
          popular: "Popular",
          discount: "Discount",
          lowStock: "Low Stock"
        },
        imageCounter: {
          of: "of"
        },
        rating: {
          outOf5: "Out of 5",
          reviews: "reviews",
          verifiedPurchase: "Verified Purchase",
          basedOn: "Based on",
          verifiedReviews: "verified reviews",
          helpful: "Helpful",
          reply: "Reply"
        },
        options: {
          availableColors: "Available Colors",
          availableSizes: "Available Sizes",
          quantity: "Quantity"
        },
        actions: {
          addToCart: "Add to Cart",
          outOfStock: "Out of Stock",
          addToWishlist: "Add to Wishlist",
          addBundleToCart: "Add Bundle to Cart",
          addedToCart: "Added to Cart",
          removeFromWishlist: "Remove from Wishlist"
        },
        features: {
          keyFeatures: "Key Features",
          bundleBenefits: "Bundle Benefits",
          whatsIncluded: "What's Included"
        },
        trust: {
          freeShipping: "Free Shipping",
          warranty: "Warranty",
          easyReturns: "Easy Returns",
          twoYearWarranty: "2 Year Warranty"
        },
        tabs: {
          productInformation: "Product Information",
          completeDetails: "Complete Details",
          productDescription: "Product Description",
          technicalSpecifications: "Technical Specifications",
          customerReviews: "Customer Reviews",
          bundleSpecifications: "Bundle Specifications",
          outOf5: "out of 5",
          basedOn: "Based on",
          verified: "Verified"
        },
        related: {
          youMightAlsoLike: "You Might Also Like",
          products: {
            drinkmateRed: "Drinkmate - OmniFizz Machine - Red",
            co2Cylinder: "CO2 Cylinder 60L",
            strawberryLemon: "Italian Strawberry Lemon Syrup"
          },
          categories: {
            sodaMakers: "Soda Makers",
            co2: "CO2",
            italianFlavors: "Italian Flavors"
          }
        },
        products: {
          names: {
            drinkmateRed: "Drinkmate - OmniFizz Machine - Red",
            drinkmateBlue: "Drinkmate - OmniFizz Machine - Blue",
            drinkmateBlack: "Drinkmate - OmniFizz Machine - Black",
            co2Cylinder: "CO2 Cylinder 60L",
            strawberryLemonSyrup: "Italian Strawberry Lemon Syrup",
            premiumFlavorsPack: "Premium Italian Flavors Pack",
            bottlesSet: "Drinkmate Bottles Set",
            energyColaFlavors: "Energy Cola Flavors"
          },
          categories: {
            sodaMakers: "Soda Makers",
            co2: "CO2",
            italianFlavors: "Italian Flavors",
            accessories: "Accessories"
          },
          descriptions: {
            drinkmateRed: "The Drinkmate OmniFizz Red is a revolutionary soda maker that allows you to carbonate any liquid, not just water. From juice and iced tea to wine and cocktails, the possibilities are endless. This premium red model combines style with functionality, featuring advanced carbonation technology and a sleek design that complements any kitchen.",
            drinkmateBlue: "The Drinkmate OmniFizz Blue offers the same revolutionary carbonation technology in a stunning blue finish. Perfect for those who prefer a cooler, more modern aesthetic while enjoying all the benefits of professional-grade soda making at home.",
            drinkmateBlack: "The Drinkmate OmniFizz Black combines elegance with functionality. This sleek black model offers the same advanced carbonation technology in a sophisticated design that fits perfectly in any modern kitchen.",
            co2Cylinder: "High-quality CO2 cylinder that provides up to 60 liters of carbonated drinks. Compatible with all Drinkmate machines and designed for safe, reliable operation. Perfect for home use and small gatherings.",
            strawberryLemonSyrup: "Authentic Italian strawberry lemon syrup made with premium ingredients. This delightful blend creates a refreshing, fruity sparkling drink that's perfect for any occasion. Made in Italy using traditional recipes.",
            premiumFlavorsPack: "A premium collection of authentic Italian syrups featuring the finest flavors from Italy. This pack includes a variety of classic and exotic flavors, perfect for creating restaurant-quality sparkling drinks at home.",
            bottlesSet: "Complete set of high-quality bottles designed specifically for Drinkmate machines. These bottles are made from food-grade materials and feature a secure seal to maintain carbonation. Perfect for storing and serving your homemade sparkling drinks.",
            energyColaFlavors: "Energizing cola flavor with a unique twist. This Italian-inspired energy cola syrup combines the classic cola taste with natural energy-boosting ingredients, creating a refreshing and invigorating sparkling drink."
          },
          specifications: {
            dimensions: "Dimensions",
            weight: "Weight",
            material: "Material",
            powerSource: "Power Source",
            capacity: "Capacity",
            co2Compatibility: "CO2 Compatibility",
            warranty: "Warranty",
            countryOfOrigin: "Country of Origin",
            volume: "Volume",
            ingredients: "Ingredients",
            origin: "Origin",
            allergens: "Allergens",
            shelfLife: "Shelf Life",
            storage: "Storage",
            serving: "Serving",
            certification: "Certification",
            contents: "Contents",
            totalVolume: "Total Volume",
            sealType: "Seal Type",
            dishwasherSafe: "Dishwasher Safe",
            bpaFree: "BPA Free",
            safety: "Safety",
            compatibility: "Compatibility",
            refillable: "Refillable"
          },
          specificationValues: {
            dimensions: "12.5\" x 8.5\" x 15.5\"",
            weight: "4.2 lbs",
            material: "Food-grade plastic and stainless steel",
            powerSource: "Manual operation",
            capacity: "1 liter bottles",
            co2Compatibility: "Standard 60L cylinders",
            warranty: "2 years limited warranty",
            countryOfOrigin: "Italy",
            volume: "500ml",
            ingredients: "Natural strawberry, lemon, sugar, water",
            origin: "Italy",
            allergens: "None",
            shelfLife: "24 months unopened",
            storage: "Store in cool, dry place",
            serving: "Makes 10-15 drinks",
            certification: "Halal certified",
            contents: "4 bottles with caps",
            totalVolume: "4 liters",
            sealType: "Screw-top with gasket",
            dishwasherSafe: "Yes",
            bpaFree: "Yes",
            safety: "Built-in safety valve",
            compatibility: "All Drinkmate machines",
            refillable: "Yes, through exchange program"
          },
          features: {
            carbonatesAnyLiquid: "Carbonates any liquid in seconds",
            advancedPressureRelease: "Advanced pressure release system",
            ergonomicDesign: "Ergonomic design for easy operation",
            foodGradeMaterials: "Food-grade materials for safety",
            compatibleWithCo2: "Compatible with all standard CO2 cylinders",
            easyToClean: "Easy-to-clean components",
            portableLightweight: "Portable and lightweight",
            noElectricityRequired: "No electricity required",
            highGradeSteel: "High-grade steel construction",
            builtInSafetyValve: "Built-in safety valve",
            refillableExchange: "Refillable through exchange program",
            longLastingPerformance: "Long-lasting performance",
            authenticItalianRecipe: "Authentic Italian recipe",
            naturalIngredients: "Natural ingredients",
            perfectBalance: "Perfect strawberry-lemon balance",
            makesDrinks: "Makes 10-15 refreshing drinks",
            halalCertified: "Halal certified",
            longShelfLife: "Long shelf life",
            noArtificialPreservatives: "No artificial preservatives",
            versatileDrinks: "Versatile for various drinks",
            premiumCollection: "8 premium Italian syrups",
            varietyFlavors: "Variety of classic flavors",
            restaurantQuality: "Restaurant-quality taste",
            greatValuePack: "Great value pack",
            completeSet: "4 bottles with secure caps",
            secureSeal: "Secure seal maintains carbonation",
            perfectStorage: "Perfect for storage and serving",
            classicCola: "Classic cola taste",
            naturalEnergy: "Natural energy boost",
            refreshingTaste: "Refreshing taste"
          },
          colors: {
            red: "Red",
            blue: "Blue",
            black: "Black",
            silver: "Silver",
            clear: "Clear",
            brown: "Brown",
            mixed: "Mixed"
          },
          sizes: {
            standard: "Standard",
            sixtyLiters: "60L",
            fiveHundredMl: "500ml",
            oneLiterX4: "1L x4",
            eightX500ml: "8x500ml"
          },
          currency: {
            sar: "{SAR_SYMBOL}",
            save: "Save"
          },
          reviews: {
            sarahAlMansouri: "Sarah Al-Mansouri",
            ahmedHassan: "Ahmed Hassan",
            fatimaZahra: "Fatima Zahra",
            riyadhSaudiArabia: "Riyadh, Saudi Arabia",
            jeddahSaudiArabia: "Jeddah, Saudi Arabia",
            dammamSaudiArabia: "Dammam, Saudi Arabia",
            twoWeeksAgo: "2 weeks ago",
            oneMonthAgo: "1 month ago",
            threeWeeksAgo: "3 weeks ago",
            sarahReview: "Absolutely love my Drinkmate OmniFizz! The Italian flavors are incredible and the machine is so easy to use. My kids love making their own sparkling drinks. Best purchase ever!",
            ahmedReview: "Perfect for hosting parties! Everyone is amazed by the quality of sparkling drinks we can make at home. The CO2 exchange program is very convenient and cost-effective.",
            fatimaReview: "Great machine overall! The red color is beautiful and it works perfectly. Only giving 4 stars because the instruction manual could be clearer for first-time users."
          }
        },
        bundleDetail: {
          whatsIncluded: "What's Included",
          quantity: "Quantity",
          addBundleToCart: "Add Bundle to Cart",
          addToWishlist: "Add to Wishlist",
          bundleBenefits: "Bundle Benefits",
          bundleSpecifications: "Bundle Specifications",
          save: "Save",
          bundles: "Bundles",
          mostPopular: "MOST POPULAR",
          addedToCart: "Added to Cart",
          removeFromWishlist: "Remove from Wishlist",
          addedToWishlist: "Added to Wishlist",
          familyBundle: {
            title: "Complete setup for the whole family with multiple flavors",
            description: "Perfect family bundle with everything you need to start making sparkling drinks at home",
            items: "x1 Soda Maker, x2 Cylinders & x5 Flavors",
            features: [
              "Complete soda maker setup",
              "Multiple CO2 cylinders for extended use",
              "Variety of premium Italian flavors",
              "Perfect for family gatherings",
              "Great value for money",
              "Easy to use and maintain"
            ],
            specifications: {
              "Soda Maker": "Drinkmate OmniFizz (Blue)",
              "CO2 Cylinders": "2x 60L cylinders",
              "Flavors Included": "5 premium Italian syrups",
              "Total Value": "{SAR_SYMBOL} 1,199.00",
              "Bundle Savings": "{SAR_SYMBOL} 200.00",
              "Warranty": "2 years on machine, 1 year on accessories"
            }
          },
          starterBundle: {
            title: "Starter Kit",
            description: "Perfect Kit for those who are using the machine for the first time",
            items: "x1 Soda Maker, x1 Cylinder & x2 Flavors",
            features: [
              "Complete starter setup",
              "Perfect for beginners",
              "2 premium Italian flavors included",
              "Easy to use and maintain",
              "Great value for money",
              "Everything you need to start"
            ],
            specifications: {
              "Soda Maker": "Drinkmate OmniFizz (Hero)",
              "CO2 Cylinders": "1x 60L cylinder",
              "Flavors Included": "2 premium Italian syrups",
              "Total Value": "{SAR_SYMBOL} 899.00",
              "Bundle Savings": "{SAR_SYMBOL} 100.00",
              "Warranty": "2 years on machine, 1 year on accessories"
            }
          },
          premiumBundle: {
            title: "Premium Bundle",
            description: "Luxury experience with premium Italian flavors",
            items: "x1 Soda Maker, x1 Cylinder & x8 Premium Flavors",
            features: [
              "Premium soda maker setup",
              "8 premium Italian flavors",
              "Luxury experience",
              "Perfect for entertaining",
              "Restaurant-quality flavors",
              "Ultimate value package"
            ],
            specifications: {
              "Soda Maker": "Drinkmate OmniFizz (Red)",
              "CO2 Cylinders": "1x 60L cylinder",
              "Flavors Included": "8 premium Italian syrups",
              "Total Value": "{SAR_SYMBOL} 1,499.00",
              "Bundle Savings": "{SAR_SYMBOL} 200.00",
              "Warranty": "2 years on machine, 1 year on accessories"
            }
          },
          features: {
            completeSetup: "Complete soda maker setup",
            multipleCylinders: "Multiple CO2 cylinders for extended use",
            varietyFlavors: "Variety of premium Italian flavors",
            familyGatherings: "Perfect for family gatherings",
            greatValue: "Great value for money",
            easyUse: "Easy to use and maintain"
          },
          specifications: {
            sodaMaker: "Soda Maker",
            co2Cylinders: "CO2 Cylinders",
            flavorsIncluded: "Flavors Included",
            totalValue: "Total Value",
            bundleSavings: "Bundle Savings",
            warranty: "Warranty",
            // Starter bundle specific values
            starterSodaMaker: "Drinkmate OmniFizz (Hero)",
            starterCo2Cylinders: "1x 60L cylinder",
            starterFlavors: "2 premium Italian syrups",
            starterTotalValue: "{SAR_SYMBOL} 899.00",
            starterBundleSavings: "{SAR_SYMBOL} 100.00",
            starterWarranty: "2 years on machine, 1 year on accessories",
            // Family bundle specific values
            familySodaMaker: "Drinkmate OmniFizz (Blue)",
            familyCo2Cylinders: "2x 60L cylinders",
            familyFlavors: "5 premium Italian syrups",
            familyTotalValue: "{SAR_SYMBOL} 1,199.00",
            familyBundleSavings: "{SAR_SYMBOL} 200.00",
            familyWarranty: "2 years on machine, 1 year on accessories",
            // Premium bundle specific values
            premiumSodaMaker: "Drinkmate OmniFizz (Red)",
            premiumCo2Cylinders: "1x 60L cylinder",
            premiumFlavors: "8 premium Italian syrups",
            premiumTotalValue: "{SAR_SYMBOL} 1,499.00",
            premiumBundleSavings: "{SAR_SYMBOL} 200.00",
            premiumWarranty: "2 years on machine, 1 year on accessories"
          }
        }
      }
    },
    recipes: {
      hero: {
        title: "Create Amazing",
        subtitle: "Drink Recipes",
        description: "Discover delicious and refreshing drink recipes using our premium Italian syrups. From classic favorites to creative combinations, there's something for everyone!",
        exploreRecipes: "Explore Recipes",
        downloadPDF: "Download PDF",
        recipesCountNumber: "45+",
        recipesLabel: "Recipes"
      },
      featuredRecipe: {
        recipeOfTheWeek: "Recipe of the Week",
        description: "This week's featured recipe showcases the perfect balance of flavors and is perfect for any occasion.",
        prepTime: "Prep Time",
        difficulty: "Difficulty",
        ingredients: "Ingredients",
        instructions: "Instructions",
        saveRecipe: "Save Recipe",
        share: "Share"
      },
      categories: {
        all: "All",
        fruity: "Fruity",
        citrus: "Citrus",
        berry: "Berry",
        cola: "Cola"
      },
      recipeData: {
        italianStrawberryLemonade: {
          name: "Italian Strawberry Lemonade",
          category: "Fruity",
          difficulty: "Easy",
          time: "5 min",
          instructions: "Mix strawberry lemon syrup with sparkling water, add fresh lemon slices and ice. Garnish with mint leaves for extra freshness."
        },
        cherryColaFizz: {
          name: "Cherry Cola Fizz",
          category: "Cola",
          difficulty: "Easy",
          time: "3 min",
          instructions: "Combine cherry cola syrup with sparkling water and ice. Serve immediately for maximum fizz."
        },
        blueRaspberryBlast: {
          name: "Blue Raspberry Blast",
          category: "Berry",
          difficulty: "Medium",
          time: "7 min",
          instructions: "Mix blue raspberry syrup with sparkling water, add fresh blueberries and mint. Garnish with a sprig of mint."
        },
        limeMojitoSparkle: {
          name: "Lime Mojito Sparkle",
          category: "Citrus",
          difficulty: "Medium",
          time: "8 min",
          instructions: "Combine lime syrup with sparkling water, add fresh lemon, mint leaves, sugar, and ice. Stir gently to mix flavors."
        },
        orangeCreamsicle: {
          name: "Orange Creamsicle",
          category: "Fruity",
          difficulty: "Easy",
          time: "4 min",
          instructions: "Mix orange and vanilla syrups with sparkling water, add cream and ice. Stir gently to create a creamy texture."
        },
        grapeSodaSupreme: {
          name: "Grape Soda Supreme",
          category: "Fruity",
          difficulty: "Easy",
          time: "3 min",
          instructions: "Combine grape syrup with sparkling water and ice. Serve immediately for the best carbonation."
        }
      },
      ingredients: {
        strawberryLemonSyrup: "Strawberry Lemon Syrup",
        cherryColaSyrup: "Cherry Cola Syrup",
        blueRaspberrySyrup: "Blue Raspberry Syrup",
        limeSyrup: "Lime Syrup",
        orangeSyrup: "Orange Syrup",
        vanillaSyrup: "Vanilla Syrup",
        grapeSyrup: "Grape Syrup",
        sparklingWater: "Sparkling Water",
        freshLemon: "Fresh Lemon",
        freshBlueberries: "Fresh Blueberries",
        mint: "Mint",
        mintLeaves: "Mint Leaves",
        sugar: "Sugar",
        cream: "Cream",
        ice: "Ice"
      },
      tags: {
        refreshing: "Refreshing",
        summer: "Summer",
        popular: "Popular",
        classic: "Classic",
        bold: "Bold",
        fizzy: "Fizzy",
        berry: "Berry",
        gourmet: "Gourmet",
        citrus: "Citrus",
        mojito: "Mojito",
        fresh: "Fresh",
        creamy: "Creamy",
        orange: "Orange",
        dessert: "Dessert",
        grape: "Grape",
        simple: "Simple"
      },
      recipeCard: {
        reviews: "reviews",
        ingredients: "ingredients",
        viewRecipe: "View Recipe"
      },
      allRecipes: {
        title: "All Recipes",
        description: "Discover our complete collection of delicious drink recipes"
      },
      newsletter: {
        title: "Get New Recipes Weekly",
        description: "Subscribe to our newsletter and receive new drink recipes, tips, and exclusive offers every week!",
        emailPlaceholder: "Enter your email",
        subscribe: "Subscribe"
      },
      difficultyLevels: {
        title: "Recipe Difficulty Levels",
        subtitle: "Choose recipes that match your skill level and experience",
        beginner: {
          title: "Beginner",
          description: "Perfect for those new to making sparkling drinks",
          feature1: "Simple ingredients",
          feature2: "Basic techniques",
          feature3: "Quick preparation"
        },
        intermediate: {
          title: "Intermediate",
          description: "Great for those with some experience",
          feature1: "Multiple ingredients",
          feature2: "Basic garnishing",
          feature3: "Flavor combinations"
        },
        advanced: {
          title: "Advanced",
          description: "For experienced drink makers",
          feature1: "Complex recipes",
          feature2: "Advanced techniques",
          feature3: "Creative presentations"
        }
      },
      seasonalRecipes: {
        title: "Seasonal Recipe Collections",
        subtitle: "Discover recipes perfect for every season",
        spring: {
          title: "Spring",
          description: "Light and refreshing flavors"
        },
        summer: {
          title: "Summer",
          description: "Cool and tropical combinations"
        },
        autumn: {
          title: "Autumn",
          description: "Warm and cozy flavors"
        },
        winter: {
          title: "Winter",
          description: "Rich and comforting drinks"
        }
      },
      communityRecipes: {
        title: "Community Recipes",
        subtitle: "Amazing recipes shared by our community",
        tropicalParadise: {
          title: "Tropical Paradise",
          description: "A refreshing blend of tropical fruits with a hint of coconut",
          by: "by Sarah M.",
          verified: "Verified"
        },
        berryBlast: {
          title: "Berry Blast",
          description: "Mixed berry explosion with mint and lime",
          by: "by Ahmed K.",
          verified: "Verified"
        },
        submitYourRecipe: "Submit Your Recipe"
      },
      nutritionalInfo: {
        title: "Nutritional Information",
        subtitle: "Learn about the health benefits and nutritional content of our drinks",
        calorieUnit: "calories",
        calorieContent: {
          title: "Calorie Content",
          plainSparklingWater: "Plain Sparkling Water",
          withNaturalSyrup: "With Natural Syrup",
          premiumSyrupMix: "Premium Syrup Mix"
        },
        healthBenefits: {
          title: "Health Benefits",
          benefit1: "Hydration without added sugars",
          benefit2: "Natural flavors from real ingredients",
          benefit3: "Low-calorie alternative to sodas"
        },
        allergenInfo: {
          title: "Allergen Information",
          info1: "All syrups are gluten-free",
          info2: "Made with natural ingredients",
          info3: "No artificial preservatives"
        }
      }
    },

    blog: {
      hero: {
        title: "Blog & News",
        subtitle: "Stay Updated",
        description: "Discover the latest news, tips, and insights about Drinkmate products and the world of sparkling beverages."
      },
      featuredPost: {
        title: "Featured Post",
        readMore: "Read More",
        publishedOn: "Published on",
        author: "by",
        category: "Category"
      },
      categories: {
        all: "All",
        news: "News",
        tips: "Tips & Tricks",
        recipes: "Recipes",
        company: "Company",
        science: "Science",
        guide: "Guide",
        products: "Products",
        environment: "Environment",
        health: "Health",
        lifestyle: "Lifestyle"
      },
      search: {
        placeholder: "Search articles...",
        searchButton: "Search"
      },
      newsletter: {
        title: "Stay Updated",
        description: "Get the latest blog posts and news delivered to your inbox",
        emailPlaceholder: "Enter your email",
        subscribe: "Subscribe"
      },
      pagination: {
        previous: "Previous",
        next: "Next",
        page: "Page",
        of: "of"
      },
      blogPosts: {
        readTime: "min read",
        publishedOn: "Published on",
        author: "Author",
        category: "Category",
        backToBlog: "Back to Blog",
        shareThisPost: "Share this post",
        relatedPosts: "Related Posts",
        tags: "Tags",
        comments: "Comments",
        leaveComment: "Leave a comment",
        commentPlaceholder: "Write your comment here...",
        postComment: "Post Comment",
        likePost: "Like",
        likedPost: "Liked",
        // Blog post content translations
        postTitles: {
          post1: "10 Refreshing Summer Drink Recipes with Drinkmate",
          post2: "The Science Behind Perfect Carbonation",
          post3: "How to Choose the Perfect CO2 Cylinder for Your Drinkmate",
          post4: "Top 5 Premium Italian Syrups for Your Drinkmate",
          post5: "Environmental Impact: How Drinkmate Reduces Plastic Waste",
          post6: "Health Benefits of Carbonated Water: Myths vs. Facts",
          post7: "How to Host the Perfect Carbonation Party with Drinkmate"
        },
        postExcerpts: {
          post1: "Beat the summer heat with these delicious and easy-to-make sparkling drink recipes using your Drinkmate machine.",
          post2: "Learn about the chemistry of carbonation and how Drinkmate technology creates the perfect fizz every time.",
          post3: "Learn how to choose the perfect CO2 cylinder size for your Drinkmate machine based on usage, cost, and convenience.",
          post4: "Discover the top 5 premium Italian syrups that will transform your Drinkmate beverages into authentic Italian delights.",
          post5: "Discover how your Drinkmate machine helps reduce plastic waste and protect the environment while saving money.",
          post6: "Discover the truth about carbonated water health benefits and debunk common myths with scientific evidence.",
          post7: "Learn how to host an unforgettable carbonation party that will showcase your Drinkmate machine and impress your guests."
        },
        postAuthors: {
          drinkmateTeam: "Drinkmate Team",
          ahmedHassan: "Dr. Ahmed Hassan",
          sarahJohnson: "Dr. Sarah Johnson",
          environmentalTeam: "Environmental Team"
        },
        postDates: {
          jan15: "January 15, 2024",
          jan12: "January 12, 2024",
          jan10: "January 10, 2024",
          jan8: "January 8, 2024",
          jan5: "January 5, 2024",
          jan3: "January 3, 2024",
          dec30: "December 30, 2023"
        },
        post1: {
          title: "10 Refreshing Summer Drink Recipes with Drinkmate",
          subtitle: "Beat the Summer Heat with Homemade Sparkling Drinks!",
          intro: "Summer is here, and what better way to beat the heat than with refreshing, homemade sparkling drinks? Your Drinkmate machine makes it incredibly easy to create delicious beverages that are not only tasty but also healthier than store-bought alternatives. Say goodbye to artificial flavors and hello to natural, customizable refreshments!",
          whyMake: {
            title: "Why Make Your Own Sparkling Drinks?",
            health: {
              title: "Health Benefits",
              benefit1: "No artificial preservatives or colors",
              benefit2: "Control over sweetness levels",
              benefit3: "Natural ingredients only",
              benefit4: "Lower sugar content"
            },
            cost: {
              title: "Cost Savings",
              saving1: "70% cheaper than store-bought",
              saving2: "Reusable bottles",
              saving3: "Bulk ingredient purchases",
              saving4: "No transportation costs"
            }
          },
          excerpt: "Beat the summer heat with these delicious and easy-to-make sparkling drink recipes using your Drinkmate machine.",
          author: "Drinkmate Team",
          date: "January 15, 2024",
          tags: {
            recipes: "Recipes",
            summer: "Summer",
            refreshing: "Refreshing",
            healthy: "Healthy",
            sparkling: "Sparkling"
          }
        },
        post2: {
          title: "The Science Behind Perfect Carbonation",
          content: "Content for science post...",
          excerpt: "Learn about the chemistry of carbonation and how Drinkmate technology creates the perfect fizz every time.",
          author: "Dr. Ahmed Hassan",
          date: "January 12, 2024",
          tags: {
            science: "Science",
            chemistry: "Chemistry",
            carbonation: "Carbonation",
            technology: "Technology"
          }
        },
        post3: {
          title: "How to Choose the Perfect CO2 Cylinder for Your Drinkmate",
          content: "Content for guide post...",
          excerpt: "Learn how to choose the perfect CO2 cylinder size for your Drinkmate machine based on usage, cost, and convenience.",
          author: "Drinkmate Team",
          date: "January 10, 2024",
          tags: {
            guide: "Guide",
            co2: "CO2",
            equipment: "Equipment",
            tips: "Tips"
          }
        },
        post4: {
          title: "Top 5 Premium Italian Syrups for Your Drinkmate",
          content: "Content for products post...",
          excerpt: "Discover the top 5 premium Italian syrups that will transform your Drinkmate beverages into authentic Italian delights.",
          author: "Drinkmate Team",
          date: "January 8, 2024",
          tags: {
            products: "Products",
            italian: "Italian",
            syrups: "Syrups",
            premium: "Premium"
          }
        },
        post5: {
          title: "Environmental Impact: How Drinkmate Reduces Plastic Waste",
          content: "Content for environment post...",
          excerpt: "Discover how your Drinkmate machine helps reduce plastic waste and protect the environment while saving money.",
          author: "Environmental Team",
          date: "January 5, 2024",
          tags: {
            environment: "Environment",
            plastic: "Plastic",
            sustainability: "Sustainability",
            green: "Green"
          }
        },
        post6: {
          title: "Health Benefits of Carbonated Water: Myths vs. Facts",
          content: "Content for health post...",
          excerpt: "Discover the truth about carbonated water health benefits and debunk common myths with scientific evidence.",
          author: "Dr. Sarah Johnson",
          date: "January 3, 2024",
          tags: {
            health: "Health",
            benefits: "Benefits",
            myths: "Myths",
            science: "Science"
          }
        },
        post7: {
          title: "How to Host the Perfect Carbonation Party with Drinkmate",
          content: "Content for lifestyle post...",
          excerpt: "Learn how to host an unforgettable carbonation party that will showcase your Drinkmate machine and impress your guests.",
          author: "Drinkmate Team",
          date: "December 30, 2023",
          tags: {
            party: "Party",
            entertainment: "Entertainment",
            social: "Social",
            lifestyle: "Lifestyle",
            carbonation: "Carbonation"
          }
        },
        authorBio: {
          team: "Our expert team of beverage enthusiasts and carbonation specialists who are passionate about helping you create the perfect sparkling drinks at home.",
          expert: "A passionate expert in their field, dedicated to sharing knowledge and insights about carbonation technology and beverage science."
        }
      }
    },
    privacyPolicy: {
      hero: {
        title: "Privacy Policy",
        subtitle: "How we protect your information",
        lastUpdated: "Effective date: September 2022"
      },
      sections: {
        introduction: {
          title: "Introduction",
          p1: "Please read this Privacy Policy carefully before accessing and using the \"Drinkmate\" Platform. We appreciate your interest and concerns about the privacy of your data online, so we have prepared this policy to help you understand the nature of the collection, use and sharing of personal data and how to handle it when you visit the \"Drinkmate\" platform.",
          p2: "This policy applies to all of your uses of the \"Drinkmate\" platform, including information, data, services, tools, and all other pages and activities that we provide on or through the platform or when you otherwise interact with us. This policy does not apply to any other third-party sites, applications, or services that link to the \"Drinkmate\" platform.",
          p3: "You acknowledge that your use of the \"Drinkmate\" platform means that you have read and understood this policy and are familiar with all of the provisions and practices stated in it."
        },
        dataCollection: {
          title: "Data Collection",
          intro: "We may collect certain data about you, which includes, for example:",
          items: [
            "Account data, such as name, mobile number, and email address.",
            "Account login data: such as login ID, password, or other security codes.",
            "Payment data: such as your credit card number, cardholder name, expiration date, authentication code, and billing address.",
            "Technical data includes the IP addresses used to connect your device to the Internet, the name and location of the device, operating system type, mobile network data including mobile number and device identifiers, version and language preferences, information you search for on the platform, access times, dates and other statistics.",
            "Log Data: Diagnostic, technical, operational error, and usage information such as the timing and duration of your use of the Services, any data stored in cookies you set on your devices, and the pages you visited before or after navigating to the Platform.",
            "Contact data, such as name, email, mobile number, message title, and subject.",
            "Feedback, opinions, and comments provided on the platform.",
            "Any other data you voluntarily decide to share with us, including, but not limited to, address, gender, country, and other similar data.",
            "Data you provided to us by filling out the forms available on the platform or any other means."
          ],
          note: "You must commit to providing complete, correct and accurate information and to maintain the confidentiality of your account information, and to specify the persons allowed to access and use your account, otherwise you will be responsible for any damages resulting from the inaccuracy of this information and data or failure to update it once it is changed. We may share said information with third parties for the purpose of designing, analyzing, managing, reporting, and improving advertising on the Platform."
        },
        limitsOnUse: {
          title: "Limits on the use of your data",
          intro: "We are always committed to protecting your privacy, and therefore we use your personal data for the following purposes:",
          items: [
            "To register and manage your account and send an email to confirm your registration on the platform.",
            "To identify you when you use the Platform and provide you with a personalized experience.",
            "To process billing and payment, and share data with payment gateways.",
            "To provide better service, as well as improve our services and the platform.",
            "To improve the quality of customer service. Your information helps us more easily respond to your directed requests and improve your customer service and support needs more effectively.",
            "To communicate with you, send emails periodically, and respond to inquiries.",
            "To prevent prohibited or illegal activities, comply with applicable law, enforce our Terms of Service and any other purposes disclosed to you at the time we collect your information or pursuant to your consent.",
            "To protect your identity and financial information, and provide you with the best possible fraud protection.",
            "To make suggestions and recommendations to you and other users about services that may be of interest to you, which may be based on your activity on the Platform.",
            "For statistical, research, analytical, marketing, promotional and survey purposes."
          ]
        },
        dataSharing: {
          title: "Data Sharing",
          intro: "We share personal data collected in accordance with this Policy with our affiliates and with other third parties that may be necessary to achieve the purposes set out in Section [3] of this Policy, and you acknowledge and agree that we may share your personal data as follows:",
          items: [
            "To comply with legal process or to comply with lawful or enforceable subpoenas or court orders.",
            "To respond to requests from public and governmental authorities.",
            "To enforce our Terms of Use and Privacy Policy.",
            "To protect our rights, privacy, safety, or property, and/or the rights of you or others.",
            "We may share information with third-party vendors who provide services or functions on our behalf, including business analytics, payment processing, customer service, marketing, public relations, survey distribution, and fraud prevention. We may also authorize third-party vendors to collect information on our behalf, including, for example, as necessary to operate features of the Platform or to facilitate the delivery of online advertising tailored to your interests. Third-party vendors have access to and may collect information only as needed to perform their functions.",
            "We may also share information with a third party in connection with any reorganization, merger, sale, joint venture, assignment, transfer, or other disposition of all or a portion of our business or assets during negotiations."
          ]
        },
        dataStorage: {
          title: "Data Storage",
          p1: "We at the \"Drinkmate\" platform only store your personal data as long as it is necessary to achieve the purposes specified in Section [3]. We also reserve the right to reconsider the current privacy terms, and you should review this policy from time to time."
        },
        dataProtection: {
          title: "Data protection and security",
          intro: "We take technical and organizational security measures to protect your data from loss, misuse, unauthorized access, disclosure, alteration or destruction. These include some of the preventive measures that:",
          items: [
            "We use firewalls, data encryption, physical access controls to our data centers and data access permission controls.",
            "We will not rent or sell your data to any third parties, and we will not allow others to use it for direct or indirect marketing purposes without obtaining your consent.",
            "We may collect, use, store and share your information if we believe it is necessary to: respond to applicable laws, regulations, legal process, or governmental requests; enforce our Terms and any other applicable terms and policies, including for the purposes of investigations of potential violations; detect and prevent cases of fraud, security and legal issues, and technical malfunctions, in addition to dealing with and investigating them; protect the rights, property, or safety of our users or the Drinkmate Platform."
          ],
          note: "This level of protection may not be 100% effective unless you follow your own security policies. You should not share your account data with anyone, and if you are concerned that any of your personal data has been exposed, you should change it immediately after logging in to your account."
        },
        compliance: {
          title: "Compliance and cooperation with regulators",
          p1: "We regularly review our compliance with our Privacy Policy, and when we receive formal written complaints, we contact the person who made the complaint to follow up, and we also work with the relevant regulators, including local data protection authorities, to resolve any complaints regarding the transfer of personal data that we cannot resolve with our users directly."
        },
        yourResponsibilities: {
          title: "Your responsibilities",
          p1: "You are responsible for ensuring that the data you provide to us is accurate, complete and up-to-date.",
          p2: "If you share any data relating to other people with us, you are responsible for that data in accordance with legal requirements, and you must inform those people whose data you provide to us about the content of this policy and obtain their prior consent."
        },
        thirdPartyLinks: {
          title: "Third Party Links",
          p1: "The \"Drinkmate\" platform may contain links that refer the user or visitor to external applications, links or websites that may collect and disclose information about you in a manner different from the platform.",
          p2: "\"Drinkmate\" platform does not control the privacy practices of external applications and websites, and we are not responsible for the content or privacy policies of those external applications and websites.",
          p3: "You should review the third party's privacy policy and terms of use when visiting any such third-party applications or websites.",
          p4: "We are not responsible for the collection, use or disclosure of any information from third parties that have a link to the \"Drinkmate\" platform."
        },
        childrenPrivacy: {
          title: "Children's privacy",
          p1: "Your guidance and participation are essential to help ensure children have a safe online experience. We encourage you to stay involved and see what your child is doing online. Your efforts will help direct your children to age-appropriate sites.",
          p2: "Drinkmate takes children's privacy seriously. We do not knowingly collect personal information from children through the Platform. If you are a minor under the law, please do not submit any personal information without the express consent and involvement of a parent or legal guardian."
        },
        modifications: {
          title: "Modifications",
          p1: "The \"Drinkmate\" platform reserves the full right to make any amendment, change, addition, or deletion to this policy in the manner and time it deems appropriate, so we advise you to review this page periodically and read it regularly, and when any important changes are published, they will be published on this page.",
          p2: "We have the right to modify our Privacy Policy at any time, and we will publish a general notice on the platform of new amendments, and we will also update the \"last updated date\" at the top of this document.",
          p3: "Your continued use of the Platform after updating this Policy constitutes your express acceptance of these amendments and your legal acceptance of the new practices and terms. If you do not agree to the new modifications and updates, you must immediately stop using the platform."
        },
        contactUs: {
          title: "Contact us",
          intro: "You can contact us at any time through:",
          emailLabel: "Email:",
          phoneLabel: "Phone number:",
          email: "cs@aqualine.sa.com",
          phone: "+966544671166",
          acknowledgment: "You acknowledge that you have read this Privacy Policy and agree to all of its terms and conditions.",
          rightsReserved: "All rights reserved to the Drinkmate platform 2025"
        }
      }
    },
    termsOfService: {
      hero: {
        title: "Terms of Service",
        subtitle: "Our terms and conditions",
        lastUpdated: "Last updated: January 2024"
      },
      sections: {
        acceptance: {
          title: "Acceptance of Terms",
          description: "By using our website and services, you agree to these terms and conditions."
        },
        services: {
          title: "Services",
          description: "We provide soda makers, CO2 cylinders, and related products and services.",
          included: [
            "Product sales and delivery",
            "CO2 refill and exchange services",
            "Customer support and warranty",
            "Online ordering and tracking"
          ]
        },
        userObligations: {
          title: "User Obligations",
          description: "Users must comply with all applicable laws and regulations.",
          obligations: [
            "Provide accurate information",
            "Use products safely and as intended",
            "Respect intellectual property rights",
            "Maintain account security"
          ]
        },
        payment: {
          title: "Payment Terms",
          description: "Payment is required at the time of order placement.",
          terms: [
            "All prices are in Saudi Riyal",
            "Payment methods accepted: Credit cards, bank transfer",
            "Orders are processed after payment confirmation",
            "Refunds processed within 5-7 business days"
          ]
        },
        shipping: {
          title: "Shipping Policy",
          description: "We offer various shipping options to meet your needs.",
          policies: [
            "Free shipping on orders above 150",
            "Standard delivery: 3-5 business days",
            "Express delivery: 1-2 business days",
            "Local pickup available in Riyadh"
          ]
        },
        returns: {
          title: "Return Policy",
          description: "We offer a 30-day return window for most products.",
          policy: [
            "Items must be in original condition",
            "Free return shipping",
            "Full refund or exchange",
            "CO2 cylinders not eligible for return"
          ]
        },
        warranty: {
          title: "Warranty",
          description: "Our products come with manufacturer warranties.",
          coverage: [
            "2-year warranty on soda makers",
            "1-year warranty on accessories",
            "Warranty covers manufacturing defects",
            "Normal wear and tear not covered"
          ]
        },
        liability: {
          title: "Limitation of Liability",
          description: "Our liability is limited to the extent permitted by law.",
          limitations: [
            "Maximum liability: purchase price of product",
            "No liability for indirect damages",
            "No liability for misuse of products",
            "Force majeure events excluded"
          ]
        },
        termination: {
          title: "Termination",
          description: "We may terminate services for violations of these terms.",
          conditions: [
            "Violation of terms and conditions",
            "Fraudulent or illegal activities",
            "Non-payment of fees",
            "Abuse of services"
          ]
        },
        contact: {
          title: "Contact Information",
          description: "For questions about these terms, please contact us.",
          email: "legal@aqualine.sa.com",
          phone: "+966544671166"
        },
        servicesDetails: {
          productSales: "Product sales and delivery",
          co2Services: "CO2 refill and exchange services",
          customerSupport: "Customer support and warranty",
          onlineOrdering: "Online ordering and tracking"
        },
        obligationsDetails: {
          accurateInfo: "Provide accurate information",
          safeUsage: "Use products safely and as intended",
          intellectualProperty: "Respect intellectual property rights",
          accountSecurity: "Maintain account security"
        },
        paymentDetails: {
          sarPrices: "All prices are in Saudi Riyal",
          paymentMethods: "Payment methods accepted: Credit cards, bank transfer",
          orderProcessing: "Orders are processed after payment confirmation",
          refundTiming: "Refunds processed within 5-7 business days"
        },
        shippingDetails: {
          freeShipping: "Free shipping on orders above 150",
          standardDelivery: "Standard delivery: 3-5 business days",
          expressDelivery: "Express delivery: 1-2 business days",
          localPickup: "Local pickup available in Riyadh"
        },
        returnsDetails: {
          originalCondition: "Items must be in original condition",
          freeReturn: "Free return shipping",
          fullRefund: "Full refund or exchange",
          co2NotEligible: "CO2 cylinders not eligible for return"
        },
        warrantyDetails: {
          sodaMakerWarranty: "2-year warranty on soda makers",
          accessoriesWarranty: "1-year warranty on accessories",
          manufacturingDefects: "Warranty covers manufacturing defects",
          normalWear: "Normal wear and tear not covered"
        },
        liabilityDetails: {
          maxLiability: "Maximum liability: purchase price of product",
          noIndirectDamages: "No liability for indirect damages",
          noMisuseLiability: "No liability for misuse of products",
          forceMajeure: "Force majeure events excluded"
        },
        terminationDetails: {
          termsViolation: "Violation of terms and conditions",
          fraudulentActivities: "Fraudulent or illegal activities",
          nonPayment: "Non-payment of fees",
          serviceAbuse: "Abuse of services"
        },
        address: "Riyadh, Saudi Arabia"
      }
    },
    exchangeAndReturnPolicy: {
      hero: {
        title: "Exchange and Return Policy",
        subtitle: "Terms and conditions for using the platform",
        lastUpdated: "Effective Date: September 2022"
      },
      sections: {
        introduction: {
          title: "The Introduction",
          p1: "Please read these terms carefully to ensure that you understand each clause before using the \"Drinkmate\" platform, as they affect your legal rights.",
          p2: "These Terms of Use together with the Privacy Policy (collectively \"Terms and Conditions\") govern your access to and use of the Drinkmate Platform, its features, and services.",
          p3: "By registering an account or using the \"Drinkmate\" platform, you confirm to us that you have read and understood these terms and agree to abide by them. If you do not agree to these terms, please do not use the platform."
        },
        definitions: {
          title: "Definitions",
          intro: "In these terms, unless the context otherwise requires, the following terms have the meanings indicated:",
          items: [
            "**\"The platform\", \"we\", \"us\" or \"our\":** refers to the \"Drinkmate\" platform.",
            "**\"User\", \"you\" or \"your\":** refers to each person who creates an Account, visits the Platform or uses the Services.",
            "**\"Service Provider\":** refers to every supplier and distributor who registers an account on the \"Drinkmate\" platform for the purpose of selling its products.",
            "**\"Consumer\":** refers to anyone who registers an account on the \"Drinkmate\" platform for the purpose of purchasing products.",
            "**\"Products\":** refers to flavors, CO2 cylinders, and related beverage products and accessories.",
            "**\"Order\":** refers to the request to purchase products through the \"Drinkmate\" platform.",
            "**\"Laws\":** refers to the laws and regulations in force in the Kingdom of Saudi Arabia.",
            "**\"Terms and Conditions\", \"Agreement\":** refers to these Terms together with the Privacy Policy and all other policies and terms."
          ]
        },
        legalLimits: {
          title: "Legal Limits of Our Services",
          p1: "Drinkmate is an electronic platform that acts as an online intermediary between product service providers and consumers who request flavors, CO2 cylinders, and related beverage products and accessories at reasonable prices and delivered to all regions of the Kingdom of Saudi Arabia.",
          p2: "The user knows and agrees that the role of the \"Drinkmate\" platform is limited to connecting the service provider and the consumer, and the platform provides the following:",
          items: [
            "Register a free account on the platform.",
            "Technical infrastructure such as a call center, a control panel for service providers to manage orders, etc.",
            "Display products on the platform.",
            "Different payment methods that suit everyone.",
            "Technical support and communication between parties."
          ],
          p3: "When a consumer contracts with a service provider through the platform, the two parties enter into a direct and legally binding relationship, and our role is limited only to connecting the service provider and the consumer.",
          p4: "The user agrees that the \"Drinkmate\" platform collects and processes transaction fees between the parties.",
          p5: "We have the right, at our sole discretion, to modify or update the current services of the platform, without any liability to any user."
        },
        legalCapacity: {
          title: "Legal Capacity",
          p1: "We want to ensure that every user is able to form legally binding contracts online; therefore, the user acknowledges that he has the legal capacity necessary to conclude and accept these terms, and that he has full unrestricted legal powers according to the following:",
          items: [
            "**Legal capacity of a natural person:** The user of the \"Drinkmate\" platform is required to be 18 years of age or older and to have the necessary legal capacity to conclude contracts. If you are under 18 years of age, you must obtain the approval of a parent or legal guardian, and their acceptance of these Terms and their agreement to accept responsibility for your actions, and any fees associated with your use of the Services.",
            "**Legal Status of a Business Entity:** If you are registering as a service provider, you acknowledge that you have the authority to bind that entity to these Terms, and that you and the business entity will be subject to all applicable laws relating to online trading.",
            "The user agrees that if he violates this clause, he will bear the consequences of this violation before others."
          ],
          p2: ""
        },
        membershipPolicy: {
          title: "Membership Policy",
          p1: "To benefit from the \"Drinkmate\" platform, you must register a valid account as required by the registration form and agree to the terms and conditions. When you become a member, you agree to:",
          items: [
            "Provide true, accurate and complete data as required in the registration form on the platform.",
            "Maintain the confidentiality of your account data, and restrict others from using the account.",
            "Accept responsibility for activities that occur under your account.",
            "Notify us immediately if the account is hacked or stolen, or if any illegal use of your account on the platform is discovered, so that we can take the necessary technical measures to maintain the account."
          ],
          p2: "We reserve the right to cancel accounts that have not been confirmed or have been inactive for a long period.",
          items2: [
            "Membership in the \"Drinkmate\" platform is provided with a licensing system to use the platform, and therefore we have the right to withdraw this license and terminate your membership in the following cases:",
            "If you do not comply with the terms, policies, rules and guidelines relating to the platform.",
            "If we are unable to confirm or verify any information provided by you.",
            "If we determine in our sole discretion that any of your actions may cause harm to us.",
            "If at any time we see fit to suspend any violating account."
          ]
        },
        purchasePolicy: {
          title: "Purchase Policy",
          items: [
            "People who can legally enter into contracts online in accordance with the laws of the Kingdom of Saudi Arabia can purchase products through the \"Drinkmate\" platform.",
            "All product data, including prices, availability, and images, is provided and updated directly from the service providers (suppliers and distributors).",
            "The offered products must be compatible with health and safety standards, authorized to be traded and sold in the Kingdom of Saudi Arabia, and guaranteed to be free of any harmful causes.",
            "The products must be healthy and usable, and the service provider must explain all their characteristics and suitability for use.",
            "Some products may have limited quantities.",
            "Some errors may occur during the process of providing products or providing detailed information about prices on the platform by service providers, so we do not bear responsibility for any errors you find while completing the order, and the platform will send a notification to the service provider to correct the errors.",
            "The Consumer agrees to pay for the Products as stated during the order process, along with any shipping costs or other fees applicable to such order.",
            "In some cases, a consumer's order may not be accepted for the following reasons:",
            "It is the consumer's responsibility to monitor the status of your order."
          ],
          subItems: [
            "Product unavailability.",
            "Stolen payments or payment fraud.",
            "If there is an error in the images, price or description of the product on the platform.",
            "If there was an error when listing a product in a sale or promotion."
          ]
        },
        pricesAndTaxes: {
          title: "Prices and Taxes Policy",
          items: [
            "All prices of products displayed on the \"Drinkmate\" platform are in the local currency (Saudi Riyal).",
            "Prices are subject to modification and updating by the service provider.",
            "Prices include 15% VAT on purchase orders. Any change in the applicable VAT rate will be automatically reflected in the product price."
          ]
        },
        paymentPolicy: {
          title: "Payment Policy",
          items: [
            "The \"Drinkmate\" platform provides payment through electronic payment gateways by credit cards, Mada, and bank transfer.",
            "You must ensure that the data you enter during the payment process is correct, accurate and valid.",
            "The user must use his bank cards and ensure that the information he enters is correct and accurate before completing the payment. If he uses one of the cards for another party, he must have an authorization or permission to use it, and thus the \"Drinkmate\" platform is not responsible for this.",
            "We do not store credit card numbers on our systems, and payment details are protected before being transmitted using the latest electronic protection technologies that follow the highest security standards.",
            "We have the right to amend this policy by adding new payment methods in the future or canceling any current method, and you will be notified if we implement this."
          ]
        },
        shippingPolicy: {
          title: "Shipping Policy",
          items: [
            "Orders are shipped to the consumer's specified address within 3 business days after confirmation by the seller.",
            "The consumer bears the order delivery fees in addition to the price of the products.",
            "The shipping process may be delayed for reasons related to force majeure or circumstances beyond our control. In this case, we will not bear any responsibilities as a result of delayed delivery of the order. You will be notified of the delay via email or phone by the seller.",
            "Please see the list of cities that are shipped to through approved shipping companies."
          ]
        },
        cancellationAndReturns: {
          title: "Cancellation and Returns Policy",
          items: [
            "\"Drinkmate\" platform reserves the exclusive right to refuse or cancel any order for flavors, CO2 cylinders, and related beverage products listed at an incorrect or unavailable price, regardless of order confirmation or payment confirmation. In such cases, if the payment is processed, the amount will be refunded to the consumer in the same original payment method.",
            "The consumer can cancel the order unless it is accepted or processed by the service provider.",
            "The \"Drinkmate\" platform does not provide or sell any products to the consumer, but rather the products are provided by service providers, who are completely independent in performing their work, and therefore the return and exchange policy of service providers will apply, and the consumer acknowledges and agrees that it may differ from one service provider to another."
          ]
        },
        useLicenses: {
          title: "Use Licenses",
          p1: "In consideration of your agreement to be bound by these Terms, we hereby grant you a non-exclusive, non-transferable, revocable right and license to:",
          items: [
            "Access and use our Services in accordance with these Terms.",
            "Access and use any content, information or related materials that may be available through our Services solely for your personal, non-commercial use, and as set forth in these Terms."
          ],
          itemsNot: [
            "Modify any content you have printed or downloaded in any way.",
            "Violate any copyright, trademark, patent, advertising or database laws or any other intellectual property rights belonging to us or licensed to us or to others.",
            "Access or attempt to access any aspect of our Services or any Content that you are not authorized to access under these Terms or as expressly specified by us."
          ],
          p2: "The license granted to the user does not include any ownership rights in the platform or part of it, nor does this license indicate, directly or indirectly, the existence of a partnership of any kind between us and any user."
        },
        securityProtection: {
          title: "Security Protection of the Platform",
          p1: "You may use our Services and the content we provide only in accordance with these Terms. You agree to the following:",
          items: [
            "You may never violate or attempt to violate the security protection of the platform.",
            "You may not license, sell, rent, transfer, assign, distribute, host or exploit the Service.",
            "It is not permissible to attempt to explore or test the capacity of the platform or network, or to attempt to penetrate the security system or levels of protection without being authorized to do so.",
            "You may not modify, translate, adapt, merge or make derivative works of any part of the Platform.",
            "You may not access the Platform in order to create similar or competing services or sites.",
            "No part of the Platform may be copied, reproduced, distributed, republished, downloaded, displayed, posted or transmitted in any form or by any means.",
            "You may not remove or destroy any logos or proprietary marks on the Platform."
          ]
        },
        intellectualProperty: {
          title: "Intellectual Property Rights",
          p1: "All legal rights, intellectual property rights, and trademarks in the \"Drinkmate\" platform, and all copyrights, trade dress, designs, logos, icons, and other intellectual properties, materials, and other rights, including software rights, the HTML code, and other codes it contains, including content and texts, fonts, images, software, audio, music, video, digital materials, documents, data and figures, are the property of us or our licensors.",
          p2: "All trademarks, service marks and trade names are owned, registered and/or licensed by us. You are not permitted to use any of our trademarks, service marks or trade names in any media or advertising without our written permission.",
          p3: "You may not copy, reproduce, distribute or commercially exploit any of our Services, including our Content, except with our express written permission."
        },
        disclaimer: {
          title: "Disclaimer",
          p1: "The services and contents of the \"Drinkmate\" platform are provided on an \"as is\" and \"as available\" basis without any guarantees or warranties of any kind, whether express or implied.",
          p2: "We make no other representations regarding our Services, or other products, services, or information obtained through the Platform, including its reliability, accuracy, quality, availability, timeliness, security or ability to meet your needs.",
          p3: "We are not responsible for the accuracy or reliability of any information or content transmitted or posted via our Services.",
          p4: "The user agrees that all information he provides to us (including registration) is true, accurate and up-to-date in all respects and that it does not violate any proprietary rights or encourage terrorism and hatred or contain material or information that is offensive to others or pornographic images, and at his own risk.",
          p5: "The user agrees to bear full responsibility for his use of the \"Drinkmate\" platform. We will not be liable for losses or damages, whether direct, indirect, consequential or incidental, arising from, including but not limited to:",
          items: [
            "Information related to products.",
            "Any failure, error, omission, malfunction, or interruption in the operation of the platform.",
            "Interruption in service due to regular maintenance work, repair of technical problems, or the like.",
            "The user fails to maintain the security, confidentiality and privacy of his account data.",
            "Circumstances beyond control, force majeure or emergency circumstances."
          ],
          p6: "We do not warrant that advertisements, their content, or images will be accurate, complete, reliable, or error-free.",
          p7: "We do our best to ensure that the Platform is available for use around the clock, but we do not guarantee that the Platform will be completely and safely available at the specified time, as the Platform may be unavailable from time to time during repair, maintenance or development work."
        },
        compensation: {
          title: "Compensation",
          p1: "You agree to hold us harmless, release and indemnify us against any and all claims, expenses, costs, actions, demands, liabilities, judgments and settlements (including appropriate legal fees) resulting or alleged to result from your use of the Services and Content and/or any breach of these Terms, and/or misuse or abuse or illegal use of the platform, regardless of its type.",
          p2: "You are obligated to compensate us for any losses or damages that may be caused to the platform as a result of any illegal or unauthorized use by you."
        },
        linksToSites: {
          title: "Links to Associated Sites",
          p1: "Please note that if you link, or are redirected, to third-party external sites when you use our Services, those other third-party sites may have different terms of use and privacy that you must adhere to and agree to before you are granted access to them.",
          p2: "We are not responsible for and do not make any representations about (or endorse in any way) any materials or services available on or from such external sites (this includes login or registration access).",
          p3: "We do not warrant in any way that these third party owned external sites will be up to date, free from errors, ambiguities or omissions, or fit for any purpose."
        },
        termAndTermination: {
          title: "Term and Termination",
          p1: "These Terms are effective immediately upon registering an account and acknowledging your acceptance and will remain in effect until terminated by either you or us.",
          p2: "We may terminate these Terms at any time without notice, if you violate any of these Terms.",
          p3: "Upon termination, all rights granted to you under these Terms will terminate."
        },
        transferOfRights: {
          title: "Transfer of Rights and Obligations",
          p1: "We may transfer all or part of our rights, obligations or responsibilities (whether express or assumed) under these Terms to any other entity, and use all reasonable endeavors to notify you of any transfer by posting on the Platform.",
          p2: "The User may not transfer all or part of his rights or obligations under these Terms to any third party without the prior written consent of the \"Drinkmate\" platform."
        },
        applicableLaw: {
          title: "Applicable Law",
          p1: "These terms are governed by and construed in accordance with the applicable laws of the Kingdom of Saudi Arabia.",
          p2: "If any of these terms are deemed unlawful, void, or unenforceable under applicable laws, then that provision will be deemed severable from these terms and will not affect the validity and enforceability of the remaining provisions."
        },
        modifications: {
          title: "Modifications",
          p1: "We have the right to review and modify these Terms in our absolute discretion at any time we deem appropriate and for any reason. Such modifications will be effective immediately upon posting them on this page, and we will update the effective date.",
          p2: "The user must review these amendments before continuing to use the \"Drinkmate\" platform.",
          p3: "Your continued use of the \"Drinkmate\" platform after making any updates to these terms and the privacy policy, whether by addition, deletion, or modification, constitutes your express consent to these updates.",
          p4: "We have the right to make any modifications or improvements we deem necessary to the \"Drinkmate\" platform to increase its effectiveness. The user is committed to any instructions provided to him by the platform in this regard."
        },
        theLanguage: {
          title: "The Language",
          p1: "These terms are written in Arabic and English, and the Arabic language will be used for the purpose of interpreting and implementing these terms if the English language conflicts with them."
        },
        fullAgreement: {
          title: "Full Agreement",
          p1: "These Terms (or as amended from time to time) define all terms of the agreement between you and the \"Drinkmate\" platform, and replace any previous versions of these Terms. In the event that these terms conflict with any previous versions, the current version shall prevail.",
          p2: ""
        },
        rightsReserved: "All rights reserved to Drinkmate 2025."
      }
    },
    cookiePolicy: {
      hero: {
        title: "Cookie Policy",
        subtitle: "How we use cookies",
        lastUpdated: "Last updated: January 2024"
      },
      sections: {
        whatAreCookies: {
          title: "What Are Cookies?",
          description: "Cookies are small text files stored on your device when you visit our website."
        },
        howWeUseCookies: {
          title: "How We Use Cookies",
          description: "We use cookies to enhance your browsing experience and provide personalized content.",
          purposes: [
            "Remember your preferences and settings",
            "Analyze website traffic and usage",
            "Provide personalized content and ads",
            "Improve website functionality",
            "Ensure security and prevent fraud"
          ]
        },
        typesOfCookies: {
          title: "Types of Cookies We Use",
          essential: "Essential cookies are necessary for the website to function properly.",
          analytics: "Analytics cookies help us understand how visitors use our website.",
          marketing: "Marketing cookies are used to deliver relevant advertisements.",
          preferences: "Preference cookies remember your choices and settings."
        },
        managingCookies: {
          title: "Managing Cookies",
          description: "You can control and manage cookies through your browser settings.",
          browser: "Browser Settings",
          settings: "Most browsers allow you to block or delete cookies."
        },
        thirdPartyCookies: {
          title: "Third-Party Cookies",
          description: "Some cookies are placed by third-party services we use.",
          services: [
            "Google Analytics for website analytics",
            "Facebook Pixel for advertising",
            "Payment processors for secure transactions",
            "Social media platforms for sharing"
          ]
        },
        updates: {
          title: "Policy Updates",
          description: "We may update this Cookie Policy from time to time. Please check back regularly."
        },
        contact: {
          title: "Contact Us",
          description: "If you have questions about our use of cookies, please contact us.",
          email: "privacy@aqualine.sa.com"
        },
        purposesDetails: {
          rememberPreferences: "Remember your preferences and settings",
          analyzeTraffic: "Analyze website traffic and usage",
          personalizedContent: "Provide personalized content and ads",
          improveFunctionality: "Improve website functionality",
          ensureSecurity: "Ensure security and prevent fraud"
        },
        thirdPartyServices: {
          googleAnalytics: "Google Analytics for website analytics",
          facebookPixel: "Facebook Pixel for advertising",
          paymentProcessors: "Payment processors for secure transactions",
          socialMedia: "Social media platforms for sharing"
        },
        address: "Riyadh, Saudi Arabia"
      }
    },
    co2: {
      hero: {
        title: "CO2 Solutions",
        subtitle: "Keep your drinks sparkling",
        description: "Premium food-grade CO2 cylinders and convenient exchange services. Maintain your Drinkmate experience with reliable CO2 solutions.",
        orderCO2: "Order CO2",
        learnMore: "Learn More",
        drinksLabel: "Drinks",
        liters: "60L"
      },
      productOptions: {
        title: "CO2 Cylinder Options",
        subtitle: "Choose the perfect CO2 solution for your needs",
        singleCylinder: {
          title: "Single Cylinder",
          description: "Perfect for individual use",
          capacity: "60 liters",
          price: "99",
          lifespan: "2-3 months",
          orderNow: "Order Now"
        },
        exchangeProgram: {
          title: "Exchange Program",
          description: "Return empty, get full",
          exchangeFee: "55",
          convenience: "Hassle-free",
          ecoFriendly: "Eco-friendly",
          exchangeNow: "Exchange Now"
        },
        bulkOrders: {
          title: "Bulk Orders",
          description: "For businesses & events",
          minQuantity: "10 cylinders",
          discount: "15% discount",
          delivery: "Free delivery",
          getQuote: "Get Quote"
        }
      },
      refillServices: {
        title: "CO2 Refill Services",
        subtitle: "Professional refilling with safety standards",
        safetyFirst: {
          title: "Safety First",
          description: "All our CO2 cylinders are food-grade certified and undergo rigorous safety inspections.",
          foodGradeCertification: "Food-grade CO2 certification",
          regularSafetyInspections: "Regular safety inspections",
          properHandlingProcedures: "Proper handling procedures",
          emergencyProtocols: "Emergency protocols"
        },
        convenientDelivery: {
          title: "Convenient Delivery",
          description: "We offer fast and reliable delivery services to your doorstep.",
          sameDayDelivery: "Same-day delivery available",
          flexibleScheduling: "Flexible scheduling",
          professionalHandling: "Professional handling",
          realTimeTracking: "Real-time tracking"
        }
      },
      exchangeProgram: {
        title: "CO2 Exchange Program",
        subtitle: "Sustainable and cost-effective solution",
        howItWorks: "How It Works",
        step1: {
          title: "Return Empty Cylinder",
          description: "Send back your empty cylinder"
        },
        step2: {
          title: "Get Full Cylinder",
          description: "Receive a fresh, full CO2 cylinder"
        },
        step3: {
          title: "Pay Difference Only",
          description: "Save up to 40% compared to new"
        },
        saveMoney: "Save money",
        ecoFriendly: "Eco-Friendly"
      },
      safetyHandling: {
        title: "CO2 Safety & Handling",
        subtitle: "Important guidelines for safe CO2 usage",
        safetyGuidelines: {
          title: "Safety Guidelines",
          guideline1: "Store in cool, dry place",
          guideline2: "Use proper container for transport",
          guideline3: "Follow safety instructions for disposal",
          guideline4: "Do not expose to high heat"
        },
        properUsage: {
          title: "Proper Usage",
          usage1: "Read instructions carefully",
          usage2: "Use proper equipment",
          usage3: "Check cylinder integrity",
          usage4: "Maintain usage records"
        }
      },
      environmentalImpact: {
        title: "Environmental Impact",
        subtitle: "Our commitment to sustainability",
        reducedWaste: {
          title: "Reduced Waste",
          description: "Reusable cylinders minimize single-use containers"
        },
        circularEconomy: {
          title: "Circular Economy",
          description: "Sustainable exchange system"
        },
        safeDisposal: {
          title: "Safe Disposal",
          description: "Proper disposal guidelines"
        }
      },
      businessSolutions: {
        title: "Business Solutions",
        subtitle: "Custom services for businesses",
        restaurantsCafes: {
          title: "Restaurants & Cafes",
          description: "Tailored CO2 solutions for food industry",
          feature1: "Wholesale pricing",
          feature2: "Scheduled deliveries",
          feature3: "Custom support",
          feature4: "24/7 service",
          getBusinessQuote: "Get Business Quote"
        },
        eventsCatering: {
          title: "Events & Catering",
          description: "Services for special events",
          feature1: "Event planning",
          feature2: "Hospitality service",
          feature3: "Professional equipment",
          feature4: "Event support",
          eventPlanning: "Event Planning"
        }
      }
    },
    // recipes: {
    //   hero: {
    //     title: "Create Recipes",
    //     subtitle: "Amazing Drinks",
    //     description: "Discover delicious and refreshing drink recipes using our premium Italian syrups. From classic favorites to creative blends, there's something for everyone!",
    //     exploreRecipes: "Explore Recipes",
    //     downloadPDF: "Download PDF",
    //     recipesCountNumber: "+45",
    //     recipesLabel: "Recipe"
    //   },
    //   featuredRecipe: {
    //     recipeOfTheWeek: "Recipe of the Week",
    //     description: "This week's featured recipe offers the perfect balance of flavors and is ideal for any occasion.",
    //     prepTime: "Preparation Time",
    //     difficulty: "Difficulty",
    //     ingredients: "Ingredients",
    //     instructions: "Instructions",
    //     saveRecipe: "Save Recipe",
    //     share: "Share"
    //   },
    //   categories: {
    //     all: "All",
    //     fruity: "Fruity",
    //     citrus: "Citrus",
    //     berry: "Berry",
    //     cola: "Cola"
    //   },
    //   recipeData: {
    //     italianStrawberryLemonade: {
    //       name: "Italian Strawberry Lemonade",
    //       category: "Fruity",
    //       difficulty: "Easy",
    //       time: "5 minutes",
    //       instructions: "Mix strawberry and lemon syrup with sparkling water, add fresh lemon slices and ice. Garnish with mint leaves for extra freshness."
    //     },
    //     cherryColaFizz: {
    //       name: "Cherry Cola Fizz",
    //       category: "Cola",
    //       difficulty: "Easy",
    //       time: "3 minutes",
    //       instructions: "Mix cherry cola syrup with sparkling water and ice. Serve immediately for maximum fizz."
    //     },
    //     blueRaspberryBlast: {
    //       name: "Blue Raspberry Blast",
    //       category: "Berry",
    //       difficulty: "Medium",
    //       time: "7 minutes",
    //       instructions: "Mix blue raspberry syrup with sparkling water, add fresh blueberries and mint. Garnish with a mint sprig."
    //     },
    //     limeMojitoSparkle: {
    //       name: "Lime Mojito Sparkle",
    //       category: "Citrus",
    //       difficulty: "Medium",
    //       time: "8 minutes",
    //       instructions: "Mix lime syrup with sparkling water, add fresh lime, mint leaves, sugar, and ice. Stir gently to blend the flavors."
    //     },
    //     orangeCreamsicle: {
    //       name: "Orange Creamsicle",
    //       category: "Fruity",
    //       difficulty: "Easy",
    //       time: "4 minutes",
    //       instructions: "Mix orange and vanilla syrup with sparkling water, add cream and ice. Stir gently for a creamy texture."
    //     },
    //     grapeSodaSupreme: {
    //       name: "Grape Soda Supreme",
    //       category: "Fruity",
    //       difficulty: "Easy",
    //       time: "3 minutes",
    //       instructions: "Mix grape syrup with sparkling water and ice. Serve immediately for the best carbonation."
    //     }
    //   },
    //   ingredients: {
    //     strawberryLemonSyrup: "Strawberry Lemon Syrup",
    //     cherryColaSyrup: "Cherry Cola Syrup",
    //     blueRaspberrySyrup: "Blue Raspberry Syrup",
    //     limeSyrup: "Lime Syrup",
    //     orangeSyrup: "Orange Syrup",
    //     vanillaSyrup: "Vanilla Syrup",
    //     grapeSyrup: "Grape Syrup",
    //     sparklingWater: "Sparkling Water",
    //     freshLemon: "Fresh Lemon",
    //     freshBlueberries: "Fresh Blueberries",
    //     mint: "Mint",
    //     mintLeaves: "Mint Leaves",
    //     sugar: "Sugar",
    //     cream: "Cream",
    //     ice: "Ice"
    //   },
    //   tags: {
    //     refreshing: "Refreshing",
    //     summer: "Summer",
    //     popular: "Popular",
    //     classic: "Classic",
    //     bold: "Bold",
    //     fizzy: "Fizzy",
    //     berry: "Berry",
    //     gourmet: "Gourmet",
    //     citrus: "Citrus",
    //     mojito: "Mojito",
    //     fresh: "Fresh",
    //     creamy: "Creamy",
    //     orange: "Orange",
    //     dessert: "Dessert",
    //     grape: "Grape",
    //     simple: "Simple"
    //   },
    //   recipeCard: {
    //     reviews: "Reviews",
    //     ingredients: "Ingredients",
    //     viewRecipe: "View Recipe"
    //   },
    //   newsletter: {
    //     title: "Get New Recipes Weekly",
    //     description: "Subscribe to our newsletter and receive new drink recipes, tips, and exclusive offers every week!",
    //     emailPlaceholder: "Enter your email",
    //     subscribe: "Subscribe"
    //   },
    //   difficultyLevels: {
    //     title: "Recipe Difficulty Levels",
    //     subtitle: "Choose recipes that match your skill and experience level",
    //     beginner: {
    //       title: "Beginner",
    //       description: "Perfect for those new to making sparkling drinks",
    //       feature1: "Simple ingredients",
    //       feature2: "Basic techniques",
    //       feature3: "Quick preparation"
    //     },
    //     intermediate: {
    //       title: "Intermediate",
    //       description: "Great for those with some experience",
    //       feature1: "Multiple ingredients",
    //       feature2: "Basic garnishing",
    //       feature3: "Flavor combinations"
    //     },
    //     advanced: {
    //       title: "Advanced",
    //       description: "For experienced drink makers",
    //       feature1: "Complex recipes",
    //       feature2: "Advanced techniques",
    //       feature3: "Creative presentations"
    //     }
    //   },
    //   seasonalRecipes: {
    //     title: "Seasonal Recipe Collections",
    //     subtitle: "Discover recipes perfect for every season",
    //     spring: {
    //       title: "Spring",
    //       description: "Light and refreshing flavors"
    //     },
    //     summer: {
    //       title: "Summer",
    //       description: "Cool and tropical blends"
    //     },
    //     autumn: {
    //       title: "Autumn",
    //       description: "Warm and comforting flavors"
    //     },
    //     winter: {
    //       title: "Winter",
    //       description: "Rich and cozy drinks"
    //     }
    //   },
    //   communityRecipes: {
    //     title: "Community Recipes",
    //     subtitle: "Amazing recipes shared by our community",
    //     tropicalParadise: {
    //       title: "Tropical Paradise",
    //       description: "A refreshing mix of tropical fruits with a hint of coconut",
    //       by: "By Sarah M.",
    //       verified: "Verified"
    //     },
    //     berryBlast: {
    //       title: "Berry Blast",
    //       description: "A burst of mixed berries with mint and lemon",
    //       by: "By Ahmed K.",
    //       verified: "Verified"
    //     },
    //     submitYourRecipe: "Submit Your Recipe"
    //   },
    //   nutritionalInfo: {
    //     title: "Nutritional Information",
    //     subtitle: "Learn about the health benefits and nutritional content of our drinks",
    //     calorieUnit: "Calories",
    //     calorieContent: {
    //       title: "Calorie Content",
    //       plainSparklingWater: "Plain Sparkling Water",
    //       withNaturalSyrup: "With Natural Syrup",
    //       premiumSyrupMix: "Premium Syrup Mix"
    //     },
    //     healthBenefits: {
    //       title: "Health Benefits",
    //       benefit1: "Hydration without added sugars",
    //       benefit2: "Natural flavors from real ingredients",
    //       benefit3: "Low-calorie alternative to soft drinks"
    //     },
    //     allergenInfo: {
    //       title: "Allergen Information",
    //       info1: "All syrups are gluten-free",
    //       info2: "Made with natural ingredients",
    //       info3: "No artificial preservatives"
    //     }
    //   }
    // }
    // ,
    contact: {
      title: "Get in Touch",
      subtitle: "We're here to help",
      description: "Have questions about our products or need support? Reach out through any channel below.",
      phoneSupport: {
        title: "Phone Support",
        description: "Speak directly with our support team",
        hours: "Mon-Fri: 9AM-6PM (AST)"
      },
      emailSupport: {
        title: "Email Support",
        description: "Send us a detailed message",
        response: "Response within 24 hours"
      },
      officeLocation: {
        title: "Office Location",
        description: "Visit our main office",
        appointment: "By appointment only"
      },
      form: {
        title: "Send us a Message",
        subtitle: "Fill out the form and we'll respond ASAP",
        fullName: "Full Name *",
        email: "Email Address *",
        phone: "Phone Number",
        subject: "Subject *",
        message: "Message *",
        sendMessage: "Send Message",
        sending: "Sending...",
        optional: "Optional",
        subjects: {
          general: "General Inquiry",
          product: "Product Question",
          support: "Technical Support",
          order: "Order Status",
          refund: "Refund Request",
          other: "Other"
        },
        placeholders: {
          fullName: "Enter your full name",
          email: "Enter your email",
          phone: "Enter your phone number",
          subject: "Select a subject",
          message: "How can we help you?"
        }
      },
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Common questions about our products",
        questions: {
          q1: "How does the Drinkmate work?",
          a1: "It uses CO2 to carbonate any liquid in seconds with simple button presses.",
          q2: "How long does a CO2 cylinder last?",
          a2: "A 60L cylinder carbonates approximately 60 liters of liquid.",
          q3: "Can I carbonate any drink?",
          a3: "Yes! Including juice, wine, cocktails, and more.",
          q4: "How do I refill CO2?",
          a4: "Use our exchange program or visit partner locations.",
          q5: "Are syrups natural?",
          a5: "Yes, all syrups use natural ingredients with no artificial preservatives.",
          q6: "What's the warranty?",
          a6: "2-year warranty on machines with extended options available."
        }
      },
      liveChat: {
        title: "Need Immediate Help?",
        description: "Chat with our support team in real-time",
        startChat: "Start Live Chat"
      },
      offices: {
        title: "Our Offices",
        subtitle: "Visit us in person",
        riyadh: {
          title: "Main Office - Riyadh",
          address: "King Fahd Road, Al Olaya, Riyadh",
          hours: "Mon-Fri: 9:00 AM - 6:00 PM",
          phone: "+966544671166"
        },
        jeddah: {
          title: "Service Center - Jeddah",
          address: "Prince Sultan Road, Al Hamra, Jeddah",
          hours: "Mon-Fri: 8:00 AM - 5:00 PM",
          phone: "+966544671166"
        }
      },
      testimonials: {
        title: "Customer Feedback",
        subtitle: "What our customers say",
        testimonial1: {
          text: "Excellent service! The team helped me choose the perfect soda maker.",
          author: "Ahmed S.",
          role: "Verified Customer"
        },
        testimonial2: {
          text: "Quick response time and very helpful staff. Resolved my CO2 refill issue quickly.",
          author: "Sarah M.",
          role: "Verified Customer"
        },
        testimonial3: {
          text: "Professional service with great product knowledge.",
          author: "Mohammed K.",
          role: "Verified Customer"
        }
      },
      loginToChat: "Login to chat",
      startLiveChat: "Start live chat"
    },
    profile: {
      hero: {
        title: "My Profile",
        description: "Manage your account settings and view your order history"
      },
      tabs: {
        profile: "Profile",
        orders: "Orders",
        security: "Security"
      },
      personalInfo: {
        title: "Personal Information",
        description: "Update your personal details and contact information",
        firstName: "First Name",
        lastName: "Last Name",
        username: "Username",
        email: "Email",
        phone: "Phone Number",
        firstNamePlaceholder: "Enter your first name",
        lastNamePlaceholder: "Enter your last name",
        usernamePlaceholder: "Enter your username",
        emailPlaceholder: "Enter your email",
        phonePlaceholder: "Enter your phone number",
        memberSince: "Member since:",
        lastLogin: "Last login:",
        edit: "Edit",
        cancel: "Cancel",
        save: "Save Changes",
        saving: "Saving..."
      },
      orders: {
        title: "Order History",
        description: "View and track your past and current orders",
        noOrders: "No orders yet",
        noOrdersDescription: "You haven't placed any orders yet.",
        startShopping: "Start Shopping",
        orderNumber: "Order #",
        status: "Status",
        total: "Total",
        date: "Date",
        items: "Items",
        shippingAddress: "Shipping Address",
        loading: "Loading orders..."
      },
      security: {
        changePassword: {
          title: "Change Password",
          description: "Update your password to keep your account secure",
          currentPassword: "Current Password",
          newPassword: "New Password",
          confirmPassword: "Confirm New Password",
          currentPasswordPlaceholder: "Enter your current password",
          newPasswordPlaceholder: "Enter your new password",
          confirmPasswordPlaceholder: "Confirm your new password",
          update: "Update Password",
          updating: "Updating..."
        },
        accountActions: {
          title: "Account Actions",
          description: "Manage your account settings and preferences",
          signOut: "Sign Out"
        }
      },
      messages: {
        profileUpdated: "Profile updated successfully",
        passwordChanged: "Password changed successfully",
        passwordsNotMatch: "New passwords do not match",
        passwordTooShort: "Password must be at least 6 characters long",
        currentPasswordIncorrect: "Current password is incorrect",
        loadingProfile: "Loading profile...",
        failedToLoadOrders: "Failed to load order history",
        failedToUpdateProfile: "Failed to update profile",
        failedToChangePassword: "Failed to change password"
      }
    },
    common: {
      loading: "Loading...",
      error: "An error occurred",
      success: "Success!",
      close: "Close",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      clear: "Clear",
      apply: "Apply",
      cancel: "Cancel",
      save: "Save",
      changeToArabic: "Change to Arabic",
      changeToEnglish: "Change to English",
      openMenu: "Open Menu",
      closeMenu: "Close Menu",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      add: "Add",
      remove: "Remove",
      quantity: "Quantity",
      total: "Total",
      subtotal: "Subtotal",
      shipping: "Shipping",
      tax: "Tax",
      discount: "Discount",
      checkout: "Checkout",
      continue: "Continue",
      back: "Back",
      home: "Home",
      about: "About",
      services: "Services",
      blog: "Blog",
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies"
    },
    refill: {
      loadingTitle: "Loading CO2 cylinders...",
      loadingSubtitle: "Please wait while we retrieve the latest cylinder information.",
      errorTitle: "Unable to load cylinder data",
      retry: "Retry",
      carousel: { goTo: "Go to slide" },
      choose: { heading: "Choose your cylinder", subheading: "Select cylinder type", needHelp: "Need Help?", drinkmate: "Drinkmate", nonDrinkmate: "Non-Drinkmate", brandPlaceholder: "Select your brand", standardThreaded: "Standard threaded" },
      qty: { title: "Quantity", subtitle: "Choose the number of cylinders to refill/exchange", label: "Number of cylinders to refill/exchange", returnNote: "Please return {{count}} empty cylinder(s)", deliveryInfo: "Estimated delivery time:", deliveryTime: "3-5 business days", freeDeliveryNote: "Free delivery for 3+ cylinders", freeDeliveryNote2Plus: "Order 2+ cylinders for free delivery", cylinder: "cylinder", emptyCylinders: "empty cylinders" },
      discounts: { twoPlus: "5% OFF", twoPlusLabel: "2+ cylinders", threePlus: "10% OFF", threePlusLabel: "3+ cylinders", fourPlus: "15% OFF", fourPlusLabel: "+ Free delivery", active: "Active" },
      offers: { heading: "Unlock the opportunity now", buy3FreeDelivery: "BUY 2+ FREE DELIVERY", buyXFreeDelivery: "BUY {{count}}+ FREE DELIVERY", buy4PriceEach: "BUY 4 59/- EACH", addOneMoreForOffer: "Add {{count}} more cylinder(s) to get this offer", addMoreForFreeDelivery: "Add {{count}} more cylinder(s) to get free delivery", returnNoteShort: "Please make sure to return {{count}} cylinder(s)" },
      cta: { addToCart: "Add cylinders to cart", subscribe: "Subscribe & save 20%", premium: "Premium membership" },
      why: { title: "Why choose our service?", f1: "Food-grade CO2 for beverages", f2: "3-5 day turnaround", f3: "Home pickup and delivery", f4: "Quality guaranteed" },
      summary: { unitPrice: "Unit price:", subtotal: "Subtotal", delivery: "Delivery:", free: "FREE", youSave: "You save:", total: "Total:", pickupNote: "* Empty cylinders will be picked up from your location", requiredReturn: "Return required:", deliveryTime: "Delivery time:", co2RefillExchange: "CO2 Cylinder Refill/Exchange" },
      tabs: { faqs: "FAQs", description: "Description", reviews: "Reviews", faqsTitle: "Frequently Asked Questions", faqsSubtitle: "Everything you need to know about our cylinder service", productDescription: "Product Description", keyFeatures: "Key Features:", customerReviews: "Customer Reviews" },
      howItWorks: {
        step1: { title: "Order Online", description: "Choose your cylinder type and quantity, then place your order on our website with one click.", label: "Order Online" },
        step2: { title: "Schedule Pickup", description: "We'll schedule a convenient time to pick up empty cylinders from your location at no extra cost.", label: "Schedule Pickup" },
        step3: { title: "Receive Refilled Cylinders", description: "Get freshly refilled CO2 cylinders delivered to your doorstep within 3-5 business days, ready to use.", label: "Receive Refilled" }
      },
      faqs: {
        q1: "How long does the refill/exchange process take?",
        a1: "Our standard turnaround time is 3-5 business days from pickup to delivery. We'll schedule a convenient pickup time and notify you when your refilled cylinders are ready for delivery.",
        q2: "What cylinder brands do you accept?",
        a2: "We accept cylinders from all major brands including Drinkmate, SodaStream, Errva, Fawwar, Phillips, and many other brands. If you're not sure about compatibility, please contact our support team.",
        q3: "Is the CO2 food-grade and safe?",
        a3: "Yes, we use only premium food-grade CO2 that meets all safety and quality standards for beverage use. Every cylinder is tested and filled according to industry regulations.",
        q4: "Do I need to return the same number of cylinders?",
        a4: "Yes, please make sure to return the same number of empty cylinders that you're ordering refills for. This helps us maintain the exchange program efficiently.",
        q5: "What quantity discounts are available?",
        a5: "We offer tiered pricing on CO₂ cylinders. Enjoy free delivery when you purchase 3 or more cylinders. When you buy 4 or more cylinders, the price drops to 59 SAR per cylinder instead of 65 SAR, with free delivery included."
      },
      carouselDescription: { refill4: "Now refill 4 cylinders all together for the price of {amount} each cylinder." }
    },
    cart: {
      title: "Shopping Cart",
      loading: "Loading cart...",
      error: "An error occurred",
      retry: "Retry",
      empty: "Your cart is empty",
      emptyDescription: "Add some items to your cart to get started",
      continueShopping: "Continue Shopping",
      orderSummary: "Order Summary",
      taxesNote: "Taxes and discount codes calculated at checkout",
      coupon: { enter: "Please enter a coupon code", applied: "Coupon applied successfully", invalid: "Invalid coupon code" },
      removeItem: "Remove Item",
      updateQuantity: "Update Quantity",
      subtotal: "Subtotal",
      shipping: "Shipping",
      tax: "Tax",
      total: "Total",
      vatIncluded: "(VAT included)",
      freeShipping: "FREE",
      freeShippingThreshold: "Free shipping on orders over 150 SAR",
      checkout: "Checkout",
      quantity: "Quantity",
      price: "Price",
      totalItems: "Total Items"
    },
    checkout: {
      title: "Checkout",
      billingInformation: "Billing Information",
      shippingInformation: "Shipping Information",
      paymentMethod: "Payment Method",
      orderSummary: "Order Summary",
      placeOrder: "Place Order",
      processingPayment: "Processing Payment...",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      city: "City",
      district: "District",
      nationalAddress: "National Address",
      deliveryOptions: "Delivery Options",
      standardDelivery: "Standard Delivery",
      expressDelivery: "Express Delivery",
      orderNotes: "Order Notes",
      agreeToTerms: "I agree to the terms and conditions",
      shipToDifferent: "Ship to a different address",
      termsPrefix: "I agree to the",
      termsLink: "Terms and Conditions",
      required: "Required",
      optional: "Optional",
      shippingCost: "Shipping",
      taxIncluded: "(VAT included)",
      country: "Country",
      deliveryInformation: "Delivery Information",
      shippingAddress: "Shipping Address",
      shortAddress: "Short Address",
      shortAddressFormat: "Format: 4 letters followed by 4 numbers (e.g., JESA3591)",
      featuredProducts: "Featured Products",
      quantity: "Quantity",
      price: "Price",
      couponCode: "Coupon Code",
      apply: "Apply",
      discount: "Discount",
      currency: "SAR",
      tabby: {
        name: "tabby",
        tagline: "Divide it by 4. Without any interest or fees.",
        benefits: {
          noInterest: "No interest",
          noFees: "No fees",
          payLater: "Pay later"
        }
      },
      newBadge: "NEW",
      privacyNote: "Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our",
      privacyPolicy: "Privacy Policy",
      guestNotice: "You are checking out as a guest.",
      login: "Log in",
      guestSuffix: "to save your information for next time.",
      loggedInAs: "Logged in as",
      validation: {
        fullNameRequired: "Full name is required",
        fullNameMinLength: "Full name must be at least 2 characters",
        fullNameInvalid: "Full name can only contain letters and spaces",
        phoneRequired: "Phone number is required",
        phoneInvalid: "Phone number can only contain numbers",
        phoneLength: "Phone number must be between 9 and 15 digits",
        districtRequired: "District is required",
        districtMinLength: "District must be at least 2 characters",
        cityRequired: "City is required",
        cityMinLength: "City must be at least 2 characters",
        emailRequired: "Email is required",
        emailInvalid: "Please enter a valid email address",
        nationalAddressLength: "National address must be exactly 8 characters",
        nationalAddressFormat: "National address must be 4 letters followed by 4 numbers (e.g., JESA3591)",
        pleaseFixErrors: "Please fix the errors in the form",
        agreeToTerms: "Please agree to the terms and conditions"
      }
    },
    auth: {
      createAccount: "Create Account",
      joinDrinkmate: "Join Drinkmate and start your sparkling journey",
      fullName: "Full Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      agreeToTerms: "I agree to the Terms and Conditions and Privacy Policy",
      alreadyHaveAccount: "Already have an account?",
      signIn: "Sign In",
      dontHaveAccount: "Don't have an account?",
      signUp: "Sign Up",
      forgotPassword: "Forgot Password?",
      resetPassword: "Reset Password",
      passwordRequirements: "Password Requirements",
      passwordMustContain: "Password must contain:",
      atLeast8Characters: "At least 8 characters",
      oneUppercaseLetter: "One uppercase letter",
      oneLowercaseLetter: "One lowercase letter",
      oneNumber: "One number",
      oneSpecialCharacter: "One special character",
      passwordsMustMatch: "Passwords must match",
      termsAndConditions: "Terms and Conditions",
      privacyPolicy: "Privacy Policy"
    },
    product: {
      inStock: "In stock",
      outOfStock: "Out of stock",
      onlyLeftInStock: "Only {count} left in stock!",
      stockCount: "{count} in stock",
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      addToWishlist: "Add to Wishlist",
      removeFromWishlist: "Remove from Wishlist",
      share: "Share",
      notifyMe: "Notify Me",
      writeReview: "Write a Review",
      askQuestion: "Ask a Question",
      description: "Description",
      specifications: "Specifications",
      reviews: "Reviews",
      questions: "Questions",
      relatedProducts: "Related Products",
      youMayAlsoLike: "You May Also Like",
      frequentlyAskedQuestions: "Frequently Asked Questions",
      customerReviews: "Customer Reviews",
      save: "Save",
      goToCart: "Go to Cart",
      quantity: "Quantity",
      keyFeatures: "Key Features",
      technicalSpecifications: "Technical Specifications",
      allReviews: "All Reviews",
      allQuestions: "All Questions",
      usageFeatures: "Usage & Features",
      installationSetup: "Installation & Setup",
      warrantySupport: "Warranty & Support",
      sold: "sold",
      reviewsCount: "reviews",
      questionsCount: "questions",
      writeAReview: "Write a Review",
      askAQuestion: "Ask a Question",
      submitReview: "Submit Review",
      submitQuestion: "Submit Question",
      defaultSafety1: "Quality tested and certified",
      defaultSafety2: "Safe for everyday use",
      rating: "Rating",
      helpful: "Helpful",
      notHelpful: "Not Helpful",
      report: "Report",
      sortBy: "Sort by",
      filterBy: "Filter by",
      newest: "Newest",
      oldest: "Oldest",
      highestRated: "Highest Rated",
      lowestRated: "Lowest Rated",
      all: "All",
      verified: "Verified",
      recommended: "Recommended",
      pros: "Pros",
      cons: "Cons",
      wouldRecommend: "Would you recommend this product?",
      yes: "Yes",
      no: "No",
      safetyQuality: "Safety & Quality",
      estimatedDelivery: "Est. delivery:",
      options: "Product Options",
      notifyWhenAvailable: "Notify When Available",
      loadingDetails: "Loading premium product details...",
      preparingExperience: "Preparing the best experience for you",
      defaultFeature: "Premium quality materials",
      badges: {
        bestSeller: "Best Seller",
        new: "New",
        ecoFriendly: "Eco-Friendly"
      },
      quickView: "Quick View",
      compareProducts: "Compare Products",
      videos: "Videos",
      qa: "Q&A",
      material: "Material",
      dimensions: "Dimensions",
      weight: "Weight",
      certifications: "Certifications",
      warranty: "Warranty",
      compatibility: "Compatibility",
      notFoundTitle: "Product Not Found",
      notFoundDescription: "The product you're looking for doesn't exist or has been removed.",
      backToShop: "Back to Shop",
      goBack: "Go Back",
      backToHome: "Back to Home",
      backToAccessories: "Back to Accessories",
      backToSodaMakers: "Back to Soda Makers",
      premium: "Premium",
      standard: "Standard",
      lightweight: "Lightweight"
    },
    footer: {
      companyDescription: "Creating perfect sparkling drinks at home with premium Italian flavors and innovative soda makers",
      phone: "+966544671166",
      email: "cs@aqualine.sa.com",
      address: "Riyadh, Saudi Arabia",
      products: {
        title: "Products",
        sodaMakers: "Drinkmate Soda Makers",
        co2Cylinders: "CO2",
        italianSyrups: "Premium Italian Syrups",
        accessories: "Accessories",
        giftBundles: "Gift For Family & Friends",
        bulkOrders: "Bulk Order Request"
      },
      information: {
        title: "Information",
        support: "Support",
        reprintReturnLabel: "Reprint Return Label",
        legalTerms: "Legal Terms",
        privacyPolicy: "Privacy Policy",
        cookiePolicy: "Cookie Policy",
        drinkmateRecipe: "Drinkmate Recipe",
        blogs: "Blogs"
      },
      more: {
        title: "More",
        trackOrder: "Track Order"
      },
      newsletter: {
        title: "Stay Refreshed with Drinkmate",
        emailPlaceholder: "Enter your email address",
        subscribeButton: "Subscribe to Newsletter",
        disclaimer: "Get exclusive offers on sodamakers, flavors & CO2 refills"
      },
      social: {
        followUs: "Follow Us"
      },
      payment: {
        title: "Payment Methods Accepted"
      },
      delivery: {
        title: "Delivery Partner"
      },
      copyright: "© 2024 Drinkmate. All rights reserved."
    }
  },
  AR: {
    header: {
      home: "الرئيسية",
      shop: "المتجر",
      sodamakers: "صانعات الصودا",
      flavor: "النكهات",
      accessories: "الإكسسوارات",
      co2: "ثاني أكسيد الكربون",
      recipes: "الوصفات",
      contactUs: "اتصل بنا",
      offers: "عروض",
      trackOrder: "تتبع الطلب",
      userMenu: "قائمة المستخدم",
      refillCylinder: "إعادة تعبئة الأسطوانة",
      refill: "إعادة ملء"
    },
    trackOrder: {
      headerTitle: "تتبع طلبك",
      headerSubtitle: "أدخل رقم بوليصة أرامكس للحصول على معلومات تتبع فورية",
      form: {
        title: "تتبع الشحنة",
        waybillLabel: "رقم البوليصة",
        placeholder: "أدخل رقم البوليصة (مثال: 1234567890)",
        placeholderShort: "أدخل رقم البوليصة",
        help: "يمكنك العثور على رقم البوليصة في بريد تأكيد الشحن",
        submit: "تتبع الطلب",
        submitting: "جارٍ التتبع..."
      },
      errors: {
        emptyWaybill: "يرجى إدخال رقم البوليصة",
        shortWaybill: "يجب أن يكون رقم البوليصة 8 أحرف على الأقل"
      },
      info: {
        email: {
          title: "تحقق من بريدك الإلكتروني",
          body: "تم إرسال رقم البوليصة إلى بريدك الإلكتروني عند شحن طلبك. تحقق من صندوق الوارد والرسائل غير المرغوب فيها."
        },
        help: {
          title: "هل تحتاج مساعدة؟",
          body: "لا يمكنك العثور على رقم البوليصة؟ تواصل مع فريق الدعم وسنساعدك في تتبع طلبك."
        }
      },
      features: {
        title: "ما الذي يمكنك تتبعه",
        realtime: { title: "حالة فورية", body: "احصل على تحديثات مباشرة حول موقع الطرد وحالة التوصيل" },
        history: { title: "تاريخ مفصل", body: "اعرض سجل التتبع الكامل مع الطوابع الزمنية والمواقع" },
        alerts: { title: "تنبيهات التوصيل", body: "احصل على إشعارات بشأن أي مشاكل أو استثناءات في التوصيل" }
      },
      results: {
        waybill: "رقم البوليصة",
        historyTitle: "سجل التتبع",
        noInfo: "لا توجد معلومات تتبع متاحة بعد."
      },
      noResults: {
        title: "لم يتم العثور على معلومات تتبع",
        desc: "لم نتمكن من العثور على أي معلومات تتبع لرقم البوليصة:",
        hint: "يرجى التحقق من رقم البوليصة والمحاولة مرة أخرى، أو التواصل مع فريق الدعم."
      },
      help: {
        title: "هل تحتاج مساعدة؟",
        cantFind: {
          title: "لا يمكنك العثور على رقم البوليصة؟",
          body: "تم إرسال رقم البوليصة إلى بريدك الإلكتروني عند شحن طلبك. تحقق من صندوق الوارد أو الرسائل غير المرغوب فيها.",
          buttonEmail: "تحقق من البريد"
        },
        stillIssues: {
          title: "ما زالت هناك مشكلة؟",
          body: "فريق الدعم لدينا هنا لمساعدتك في تتبع طلبك.",
          buttonSupport: "اتصل بالدعم"
        }
      }
    },
    account: {
      loading: "جاري تحميل بيانات الحساب...",
      loadingErrorTitle: "خطأ في التحميل",
      tryAgain: "إعادة المحاولة",
      errors: {
        notAuthenticated: "غير مسجل الدخول",
        failedLoad: "فشل في تحميل بيانات الحساب"
      },
      welcome: "مرحباً",
      manageAccount: "إدارة حسابك وطلباتك",
      stats: { orders: "الطلبات", rating: "التقييم" },
      profile: {
        title: "معلومات الملف الشخصي",
        fullName: "الاسم الكامل",
        phoneNumber: "رقم الهاتف",
        phone: "الهاتف",
        email: "البريد الإلكتروني",
        emailUnchangeable: "لا يمكن تغيير البريد الإلكتروني",
        save: "حفظ التغييرات",
        cancel: "إلغاء",
        edit: "تعديل"
      },
      address: {
        title: "العنوان",
        district: "الحي",
        city: "المدينة",
        country: "البلد",
        countryValue: "المملكة العربية السعودية",
        enterDistrict: "أدخل الحي",
        enterCity: "أدخل المدينة",
        shortAddress: "العنوان المختصر",
        nationalAddressLink: "العنوان الوطني",
        optional: "(اختياري)",
        placeholder: "JESA3591",
        formatHint: "التنسيق: 4 أحرف متبوعة بـ 4 أرقام (مثال: JESA3591)",
        save: "حفظ العنوان",
        saving: "جاري الحفظ...",
        cancel: "إلغاء",
        viewLabel: "العنوان",
        edit: "تعديل"
      },
      password: {
        title: "تغيير كلمة المرور",
        current: "كلمة المرور الحالية",
        new: "كلمة المرور الجديدة",
        confirm: "تأكيد كلمة المرور",
        change: "تغيير كلمة المرور",
        cancel: "إلغاء",
        security: "أمان الحساب",
        strong: "كلمة مرور قوية",
        lastUpdated: "آخر تحديث: منذ شهر"
      },
      orders: {
        title: "الطلبات والإرجاع",
        itemsSuffix: "عناصر",
        view: "عرض",
        viewAll: "عرض جميع الطلبات"
      },
      toasts: {
        nameRequired: "يرجى ملء الاسم الكامل",
        loginFirst: "يرجى تسجيل الدخول أولاً",
        profileSaved: "تم حفظ الملف الشخصي بنجاح!",
        profileSaveError: "حدث خطأ في حفظ الملف الشخصي",
        addressValidation: "يرجى ملء الحي والمدينة",
        nationalAddressInvalid: "يجب أن يكون التنسيق: 4 أحرف متبوعة بـ 4 أرقام (مثال: JESA3591)",
        addressSaved: "تم حفظ العنوان بنجاح!",
        addressSaveError: "حدث خطأ في حفظ العنوان",
        passwordAllRequired: "جميع الحقول مطلوبة",
        passwordMismatch: "كلمة المرور الجديدة غير متطابقة",
        passwordTooShort: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
        passwordNotAuthenticated: "غير مسجل الدخول",
        passwordChanged: "تم تغيير كلمة المرور بنجاح",
        passwordChangeError: "حدث خطأ في تغيير كلمة المرور"
      }
    },
    banner: {
      messages: {
        freeDelivery: "🚚 توصيل مجاني للطلبات فوق 150 ﷼",
        colaFlavors: "🥤 احصل على 3 نكهات كولا مقابل 149 ﷼ فقط استخدم الكود كولا44",
        firstOrderDiscount: "🎉 احصل على خصم 5% على أول طلب معنا استخدم الكود ",
        megaOffer: "⚡ درينك ميت أومني فيز يبدأ من 599 ﷼",
        cylinderRefill: "🔄 إعادة تعبئة الأسطوانة ثاني أكسيد الكربون من 65 ﷼"
      },
      codes: {
        cola44: "كولا44",
        new25: "جديد25"
      }
    },
    banners: {
      premiumItalianSyrups: { title: "مشروبات إيطالية فاخرة", subtitle: "طبيعي 100٪ | بدون سكر مضاف" },
      colaBundle: "باقة الكولا",
      easyRefill: "إعادة تعبئة سهلة | استبدال سلس."
    },
    home: {
      hero: {
        title: "المشروبات الغازية أصبحت بسيطة",
        subtitle: "مع درينك ميت أومني فيز",
        description: "استمتع بنكهة الفراولة الإيطالية المجانية مع شراء آلة اللون الأزرق القطبي.",
        exploreMore: "استكشف المزيد",
        buyNow: "اشتر الآن"
      },
      refill: {
        title: "تسوق أكثر. ووفّر أكثر.",
        description: "الآن أعد ملء 4 أسطوانات معاً بسعر 55 ريال لكل أسطوانة.",
        buttonText: "تسوق الآن",
        offerText: "*العرض صالح طوال العام*",
        carbonatesUpto: "يغوز حتى",
        liters: "60",
        litersOfDrink: "لتراً من المشروب",
        slide2: {
          headline: "احصل على نكهة مشروب الطاقة والكولا مقابل 79",
          description: "تغلب على حرارة الصيف مع أكثر منتجاتنا مبيعاً.",
          buttonText: "تسوق الآن"
        },
        slide3: {
          headline: "خصم 5% على أول طلب لعملائنا الجدد",
          description: "تدخل إلى عالم الفقاعات؟ استمتع بخصم 5% على أول طلب مع درينك ميت.",
          buttonText: "تسوق الآن"
        }
      },

      features: {
        title: "لماذا تختار درينك ميت",
        subtitle: "الجودة العالية تلتقي بالتكنولوجيا المبتكرة",
        feature1: {
          title: "تغويز متعدد الاستخدامات",
          description: "أضف الغاز لأي سائل بما في ذلك العصير والنبيذ والكوكتيلات"
        },
        feature2: {
          title: "النكهات الإيطالية",
          description: "شراب إيطالي أصيل مصنوع من مكونات طبيعية"
        },
        feature3: {
          title: "صديق للبيئة",
          description: "قلل من النفايات البلاستيكية مع الزجاجات القابلة لإعادة الاستخدام"
        }
      },
      products: {
        title: "المنتجات المميزة",
        subtitle: "اكتشف أفضل منتجاتنا مبيعاً",
        viewAll: "عرض الكل"
      },
      testimonials: {
        title: "ماذا يقول عملاؤنا",
        subtitle: "تعليقات حقيقية من عملاء راضين",
        testimonial1: {
          text: "خدمة عملاء ممتازة! ساعدني الفريق في اختيار صانعة الصودا المثالية والدعم كان مذهلاً.",
          author: "أحمد س.",
          role: "عميل موثق"
        },
        testimonial2: {
          text: "وقت استجابة سريع وموظفين مفيدين جداً. حلوا مشكلة إعادة ملء ثاني أكسيد الكربون في غضون ساعات.",
          author: "سارة م.",
          role: "عميلة موثقة"
        },
        testimonial3: {
          text: "خدمة احترافية ومعرفة كبيرة بالمنتجات. إنهم يعرفون عملهم حقاً!",
          author: "محمد ك.",
          role: "عميل موثق"
        }
      },
      carousel: {
        slide1: {
          headline: "أعد التعبئة أكثر. ووفّر أكثر.",
          description: "الآن أعد ملء 4 أسطوانات معاً بسعر 55 ريال لكل أسطوانة.",
          buttonText: "أعد التعبئة الآن",
          offerText: "*العرض صالح طوال العام*",
          carbonatesUpto: "يضيف الغاز حتى",
          liters: "60",
          litersOfDrink: "لتر من المشروب"
        },
        slide2: {
          headline: "احصل على مشروب الطاقة ونكهة الكولا مقابل 79 ريال",
          description: "تغلب على حرارة الصيف مع أفضل مبيعاتنا.",
          buttonText: "أعد الملء الآن"
        },
        slide3: {
          headline: "خصم 5% على أول طلب للعملاء الجدد",
          description: "تود دخول عالم المشروبات الغازية؟ استمتع بخصم 5% على أول طلب مع درينك ميت",
          buttonText: "تسوق الآن"
        }
      },
      productCategories: {
        title: "فئات منتجاتنا",
        sodaMakers: "صانعات الصودا",
        co2: "ثاني أكسيد الكربون",
        premiumItalianFlavors: "النكهات الإيطالية عالية الجودة",
        accessories: "الملحقات"
      },
      megaOffer: {
        title: "درينك ميت أومني فيز",
        description: "على عكس صانعات الصودا التقليدية، تسمح لك درينك ميت أومني فيز بإضافة الغاز لأي مشروب بسهولة، من العصير والشاي المثلج إلى النبيذ والكوكتيلات، مما يوفر إمكانيات لا تنتهي للمشروبات الغازية المنعشة.",
        availableColors: "خيارات الألوان المتاحة",
        offersBundles: "حزم",
        exploreMore: "استكشف المزيد"
      },
      howItWorks: {
        title: "كيف تعمل درينك ميت أومني فيز؟",
        subtitle: "أربع خطوات بسيطة توضح لك كيفية استخدام درينك ميت أومني فيز",
        description: "أربع خطوات بسيطة توضح لك كيفية استخدام درينك ميت أومني فيز",
        steps: {
          step1: {
            title: "املأ",
            description: "املأ الزجاجة بالمشروب الذي تريده.",
            alt: "الخطوة 1: املأ الزجاجة"
          },
          step2: {
            title: "فوران",
            description: "اضغط على الزر لتحويل مشروبك إلى مشروب غازي.",
            alt: "الخطوة 2: تحويل المشروب إلى غازي"
          },
          step3: {
            title: "اقلب",
            description: "افتح الصمام على جهاز الحقن لإطلاق الضغط.",
            alt: "الخطوة 3: اقلب لإطلاق الضغط"
          },
          step4: {
            title: "استمتع!",
            description: "اسكب في كوب واستمتع بالمشروب.",
            alt: "الخطوة 4: استمتع بالمشروب"
          }
        }
      },
      co2Section: {
        title: "لماذا ثاني أكسيد الكربون؟",
        litersOfDrinks: "لتر من المشروبات",
        description: "غاز ثاني أكسيد الكربون يضيف الفقاعات والغاز للماء. ثاني أكسيد الكربون الغذائي الخاص بنا يضمن مشروبات مضمونة وطازجة وغازية في كل مرة.",
        descriptionAr: "مع برنامج تبادل ثاني أكسيد الكربون من Drinkmate، أرسل الأسطوانات الفارغة واحصل على خصم على مشترياتك القادمة من ثاني أكسيد الكربون. سهل ومستدام وجاهز للفوران—دائماً.",
        learnMore: "اعرف المزيد",
        learnMoreAr: "اعرف المزيد",
        ShopNow: "تسوق الآن",
        ShopNowAr: "تسوق الآن",
        exploreSubscriptions: "استكشف الاشتراكات",
        exploreSubscriptionsAr: "استكشف الاشتراكات",
        benefits: {
          easyExchange: "تبادل سهل للأسطوانات",
          easyExchangeAr: "تبادل سهل للأسطوانات",
          sustainable: "مستدام وصديق للبيئة",
          sustainableAr: "مستدام وصديق للبيئة",
          fizzReady: "دائماً جاهز للفوران",
          fizzReadyAr: "دائماً جاهز للفوران"
        }
      },
      flavorSection: {
        subtitle: "لا تكتفِ بكربنة المياه فقط",
        title: "كربن أي شيء",
        description: "اكتشف نكهاتنا الإيطالية عالية الجودة وأنشئ مشروبات غازية مذهلة في المنزل. من الكولا الكلاسيكي إلى تركيبات الفواكه الغريبة، الإمكانيات لا تنتهي!",
        exploreFlavors: "استكشف النكهات"
      },
      additionalSections: {
        howToUse: {
          title: "كيفية الاستخدام",
          description: "تعلم كيفية صنع مشروبات مثالية في كل مرة باستخدام سيروبات درينك ميت الإيطالية عالية الجودة."
        },
        recipes: {
          title: "الوصفات",
          description: "مشروبات منزلية الصنع مصممة خصيصاً لك لتجربتها والاستمتاع بها."
        },
        premiumFlavors: {
          title: "النكهات الإيطالية عالية الجودة",
          description: "اعرف وجرب جميع نكهاتنا الطبيعية الـ 22 الخالية من السكر عالية الجودة."
        }
      },
      environmental: {
        subtitle: "اعرف المزيد عن جهود درينك ميت من أجل",
        title: "بيئة أكثر خضرة وأفضل",
        plasticImpact: "تأثيرنا على استخدام البلاستيك لمرة واحدة",
        naturalFlavors: "كيف تُصنع نكهاتنا الطبيعية",
        healthBenefits: "الفوائد الصحية للمياه الغازية"
      }
    },
    cylinders: {
      banner: {
        title: "استبدال CO₂ / إعادة تعبئة CO₂",
        subtitle: "استبدال وإعادة تعبئة سريعة وموثوقة لثاني أكسيد الكربون حتى لا يتوقف الفوران أبداً."
      },
      cardNew: {
        title: "أسطوانة جديدة / احتياطية",
        description: "احتفظ بأسطوانة احتياطية حتى لا ينفد مشروبك الغازي. اشترِ أسطوانة جديدة مقابل 175.00 ريال فقط",
        shopNow: "تسوق الآن",
        imageAlt: "أسطوانات Drinkmate CO2 جديدة"
      },
      cardRefill: {
        title: "إعادة تعبئة / استبدال الأسطوانة",
        description: "أحضر أسطوانتك الفارغة واستلم أسطوانة ممتلئة بسعر إعادة التعبئة فقط، يبدأ من",
        shopNow: "تسوق الآن",
        imageAlt: "إعادة تعبئة أو استبدال أسطوانة CO2"
      },
      effortless: {
        title: "فوران بلا جهد مع Drinkmate CO₂",
        quickRefill: "إعادة تعبئة واستبدال أسطوانات سريعة وبلا متاعب",
        spareCylinder: "احتفظ بأسطوانة احتياطية لعدم انقطاع الفوران",
        foodGrade: "CO₂ غذائي آمن لتحويل ثابت",
        ecoFriendly: "استبدال أسطوانات صديق للبيئة يقلل النفايات"
      },
      exchangeBanner: {
        title: "الاستبدال ببساطة",
        description: "استبدل أسطوانة CO₂ الفارغة بأخرى ممتلئة حديثاً. ادفع فقط ثمن إعادة التعبئة وحافظ على مشروباتك الغازية دون انقطاع.",
        shopNow: "تسوق الآن",
        imageAlt: "استبدال أسطوانات فارغة بأسطوانات ممتلئة CO2"
      }
    },
    shop: {
      title: "تسوق منتجاتنا",
      subtitle: "صانعات الصودا عالية الجودة والنكهات الإيطالية الأصيلة",
      description: "اكتشف مجموعتنا الكاملة من صانعات الصودا وأسطوانات ثاني أكسيد الكربون والشرابات الإيطالية عالية الجودة والملحقات. كل ما تحتاجه لإنشاء مشروبات غازية مثالية في المنزل.",
      co2BannerHeading: "من هنا يبدأ الفوران",
      hero: {
        title: "تسوق",
        subtitle: "منتجاتنا",
        description: "اكتشف مجموعتنا الكاملة من صانعات الصودا وأسطوانات ثاني أكسيد الكربون والشرابات الإيطالية عالية الجودة والملحقات. كل ما تحتاجه لإنشاء مشروبات غازية مثالية في المنزل."
      },
      refill: {
        title: "أعد الملء أكثر. ووفّر أكثر.",
        description: "الآن أعد ملء 4 أسطوانات معاً بسعر 55 ريال لكل أسطوانة.",
        buttonText: "أعد الملء الآن",
        offerText: "*العرض صالح طوال العام*",
        carbonatesUpto: "يضيف الغاز حتى",
        liters: "60",
        litersOfDrink: "لتر من المشروب",
        slide2: {
          headline: "احصل على مشروب الطاقة ونكهة الكولا مقابل 79 ريال",
          description: "تغلب على حرارة الصيف مع أفضل مبيعاتنا.",
          buttonText: "أعد الملء الآن"
        },
        slide3: {
          headline: "خصم 5% على أول طلب للعملاء الجدد",
          description: "تدخل عالم المشروبات الغازية؟ استمتع بخصم 5% على أول طلب مع درينك ميت.",
          buttonText: "تسوق الآن"
        }
      },
      bundles: {
        title: "الباقات",
        subtitle: "عالية الجودة",
        description: "اكتشف باقاتنا المدروسة بعناية والمصممة لإعطائك تجربة درينك ميت المثالية. وفر الكثير مع الحصول على كل ما تحتاجه في حزمة مثالية واحدة.",
        starterKit: "طقم البداية",
        familyPack: "طقم العائلة",
        premiumBundle: "الباقة المميزة",
        starterKitDescription: "كل ما تحتاجه للبدء مع درينك ميت.",
        familyPackDescription: "مثالي للعائلات التي ترغب في تغذية مشروباتها.",
        premiumBundleDescription: "تجربة درينك ميت المثالية، كل شيء في حزمة واحدة.",
        starterKitItems: "1 درينك ميت أومني فيز، 1 أسطوانة ثاني أكسيد الكربون، 1 زجاجة شراب الفراولة والليمون",
        familyPackItems: "2 درينك ميت أومني فيز، 2 أسطوانة ثاني أكسيد الكربون، 2 حزمة نكهات إيطالية عالية الجودة، 1 مجموعة زجاجات",
        premiumBundleItems: "3 درينك ميت أومني فيز، 3 أسطوانة ثاني أكسيد الكربون، 3 حزمة نكهات إيطالية عالية الجودة، 1 مجموعة زجاجات، 1 حزمة نكهات الكولا الطاقة",
        includes: "يتضمن:",
        save: "وفر",
        shopNow: "تسوق الآن",
        getPopularBundle: "🔥 احصل على الباقة الشائعة",
        limitedTimeOffer: "⚡ عرض لفترة محدودة",
        bestSeller: "🔥 الأكثر مبيعاً",
        mostPopular: "⭐ الأكثر شعبية",
        limitedTimeOfferText: "عرض لفترة محدودة"
      },
      filters: {
        all: "الكل",
        machines: "صانعات الصودا",
        flavors: "النكهات الإيطالية",
        accessories: "الملحقات",
        showing: "عرض",
        products: "منتج",
        sortBy: "ترتيب حسب:",
        featured: "مميز",
        priceLowToHigh: "السعر: من الأقل إلى الأعلى",
        priceHighToLow: "السعر: من الأعلى إلى الأقل",
        highestRated: "الأعلى تقييماً",
        newest: "الأحدث",
        loadMore: "تحميل المزيد من المنتجات",
        quickStats: "إحصائيات سريعة",
        totalProducts: "إجمالي المنتجات",
        categories: "الفئات",
        brands: "العلامات التجارية",
        inStock: "متوفر",
        filters: "الفلاتر",
        priceRange: "نطاق السعر",
        minPrice: "الحد الأدنى للسعر",
        maxPrice: "الحد الأقصى للسعر",
        customerRating: "تقييم العملاء",
        availability: "التوفر",
        specialOffers: "العروض الخاصة",
        allCategories: "جميع الفئات",
        inStockOnly: "متوفر فقط",
        newProducts: "منتجات جديدة",
        bestSellers: "الأكثر مبيعاً",
        onSale: "عروض",
        clearAll: "مسح الكل",
        showResults: "عرض النتائج",
        productsFound: "منتج موجود"
      },
      search: {
        placeholder: "البحث عن المنتجات أو العلامات التجارية أو الفئات...",
        helpText: "ابحث عن المنتجات بالاسم أو العلامة التجارية أو الفئة. ستحدّث النتائج أثناء الكتابة.",
        searchingFor: "البحث عن",
        results: "نتيجة",
        clearSearch: "مسح البحث"
      },
      sort: {
        mostPopular: "الأكثر شعبية",
        priceLowToHigh: "السعر: من الأقل إلى الأعلى",
        priceHighToLow: "السعر: من الأعلى إلى الأقل",
        newestFirst: "الأحدث أولاً",
        highestRated: "الأعلى تقييماً",
        helpText: "اختر طريقة ترتيب المنتجات. الخيارات تشمل الشعبية والسعر والأحدث والتقييم."
      },
      pagination: {
        previous: "السابق",
        next: "التالي"
      },
      contact: {
        hero: { title: "تواصل معنا", subtitle: "نحن هنا لمساعدتك. اختر أفضل طريقة للتواصل معنا." },
        options: {
          heading: "خيارات التواصل",
          whatsapp: { title: "واتساب", availability: "الردود عادة 9–5", button: "الدردشة عبر واتساب" },
          email: { title: "البريد الإلكتروني", availability: "نرد خلال يوم عمل واحد", button: "أرسل بريدًا إلى support@drinkmates.com" },
          chat: {
            title: "الدردشة المباشرة",
            checking: "جارٍ التحقق من التوفر...",
            loginRequired: "يلزم تسجيل الدخول لبدء الدردشة",
            avgReply: "متوسط الرد ~2 دقيقة",
            opensAt: "تفتح في",
            buttonLoading: "جارٍ التحميل...",
            buttonLogin: "سجّل الدخول للدردشة",
            buttonStart: "ابدأ الدردشة المباشرة"
          },
          show: "عرض",
          hide: "إخفاء"
        },
        status: { available: "مباشرة الآن", offline: "غير متصل", always: "طوال اليوم", loginRequired: "يتطلب تسجيل الدخول" },
        form: {
          title: "نموذج التواصل",
          subtitle: "أرسل لنا رسالة في أي وقت.",
          reason: "سبب التواصل",
          reasons: {
            general: "استفسار عام",
            order: "بخصوص الطلب",
            billing: "سؤال عن الفواتير",
            technical: "دعم فني",
            refund: "طلب استرداد",
            other: "أخرى"
          },
          name: "الاسم الكامل *",
          namePlaceholder: "أدخل اسمك الكامل",
          nameRequired: "الاسم مطلوب",
          email: "البريد الإلكتروني *",
          emailPlaceholder: "أدخل بريدك الإلكتروني",
          emailRequired: "البريد الإلكتروني مطلوب",
          phone: "الهاتف (اختياري)",
          phoneHint: "لتسريع المتابعة",
          message: "الرسالة *",
          messagePlaceholder: "أخبرنا كيف يمكننا مساعدتك...",
          messageMin: "الحد الأدنى 10 أحرف",
          attachments: "المرفقات (اختياري)",
          uploadBtn: "ارفع حتى 3 ملفات / 10MB",
          uploadHint: "(JPG, PNG, GIF, PDF)",
          consent: "أوافق على سياسة الخصوصية وشروط الخدمة",
          submit: "إرسال الرسالة",
          submitting: "جارٍ الإرسال...",
          errors: {
            fillAll: "يرجى تعبئة جميع الحقول المطلوبة",
            consent: "يرجى الموافقة على سياسة الخصوصية وشروط الخدمة",
            maxFiles: "الحد الأقصى 3 ملفات",
            fileTooLarge: "الملف كبير جدًا. الحد الأقصى 10MB.",
            invalidType: "نوع ملف غير صالح. المسموح JPG و PNG و GIF و PDF",
            submitFail: "فشل إرسال الرسالة"
          },
          success: {
            heading: "لقد استلمنا رسالتك — التذكرة DM-",
            subtitle: "سنرد خلال يوم عمل واحد. تم إرسال رسالة تأكيد.",
            another: "أرسل رسالة أخرى"
          },
          history: {
            title: "رسائلك السابقة والردود",
            yourMessage: "رسالتك:",
            ourResponse: "ردّنا:"
          }
        },
        faq: {
          heading: "الأسئلة الشائعة",
          searchPlaceholder: "ابحث في الأسئلة الشائعة…",
          cta: "لم تجد ما تبحث عنه؟",
          categories: {
            orders: "الطلبات والتسليم",
            refill: "التعبئة والاستبدال",
            returns: "الإرجاع والضمان",
            payment: "الدفع والفواتير"
          },
          viewAll: "عرض جميع {{count}} سؤالًا →",
          emailSubject: "سؤال عن الأسئلة الشائعة",
          emailBody: "لم أجد الإجابة على سؤالي في الأسئلة الشائعة. أحتاج مساعدة بخصوص:\n\n"
        },
        map: {
          visit: "زر مكتبنا",
          seeUs: "يسعدنا زيارتك",
          officeInfo: "معلومات المكتب",
          address: "العنوان",
          businessHours: "ساعات العمل",
          phone: "الهاتف",
          getDirections: "احصل على الاتجاهات",
          googleMaps: "خرائط قوقل",
          appleMaps: "خرائط آبل",
          city: "السلامة، جدة",
          country: "المملكة العربية السعودية"
        }
      },
      categoryPages: {
        explorePremium: "استكشف منتجاتنا المميزة",
        loadingProducts: "جاري تحميل المنتجات المميزة...",
        failedToLoad: "فشل تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقاً.",
        noProductsFound: "لم يتم العثور على منتجات في هذه الفئة.",
        checkBackLater: "يرجى التحقق لاحقاً أو تجربة فئة مختلفة.",
        errorLoading: "خطأ في تحميل المنتجات",
        activeFilters: "الفلاتر النشطة:",
        tryAgain: "حاول مرة أخرى",
        filterApplied: "فلتر مطبق",
        filtersApplied: "فلاتر مطبقة",
        trySearchingFor: "جرب البحث عن:",
        shopByCategory: "تسوق حسب الفئة",
        discoverCollection: "اكتشف مجموعتنا المميزة من صانعات الصودا والنكهات والإكسسوارات",
        shopAllProducts: "تسوق جميع المنتجات",
        omnifizzTitle: "صانعات الصودا أومني فيز",
        omnifizzDescription: "تغويز مميز لجميع المشروبات",
        luxeTitle: "صانعات الصودا الفاخرة",
        luxeDescription: "تجربة تغويز فاخرة وأنيقة",
        sodamakers: {
          title: "استكشف صانعات الصودا المميزة لدينا"
        },
        flavors: {
          title: "استكشف نكهاتنا المميزة"
        },
        accessories: {
          title: "استكشف الإكسسوارات المميزة لدينا"
        },
        co2: {
          title: "استكشف أسطوانات ثاني أكسيد الكربون لدينا"
        }
      },
      products: {
        addToCart: "أضف إلى السلة",
        selectOptions: "اختر الخيارات",
        outOfStock: "نفذت الكمية",
        new: "🆕 جديد",
        popular: "⭐ شائع",
        discount: "💥",
        verified: "موثق",
        reviews: "تقييم",
        rating: "تقييم",
        productNames: {
          drinkmateRed: "درينك ميت أومني فيز اللون الأحمر",
          drinkmateBlue: "درينك ميت أومني فيز اللون الأزرق",
          drinkmateBlack: "درينك ميت أومني فيز اللون الأسود",
          co2Cylinder: "أسطوانة ثاني أكسيد الكربون",
          strawberryLemonSyrup: "شراب الفراولة والليمون",
          premiumFlavorsPack: "حزمة نكهات إيطالية عالية الجودة",
          bottlesSet: "مجموعة زجاجات",
          energyColaFlavors: "حزمة نكهات الكولا الطاقة"
        },
        categories: {
          sodaMakers: "صانعات الصودا",
          co2: "ثاني أكسيد الكربون",
          italianFlavors: "النكهات الإيطالية",
          accessories: "الملحقات"
        }
      },

      customerReviews: {
        title: "ماذا يقول",
        subtitle: "عملاؤنا",
        description: "تقييمات حقيقية من مستخدمي درينك ميت الراضين في جميع أنحاء العالم",
        joinCustomers: "انضم إلى أكثر من 10,000 عميل سعيد",
        experienceDifference: "اختبر فرق درينك ميت اليوم!",
        verified: "موثق",
        reviews: {
          sarah: {
            name: "سارة المنصوري",
            location: "الرياض، المملكة العربية السعودية",
            review: "أحب آلة درينك ميت أومني فيز! النكهات الإيطالية مذهلة والآلة سهلة الاستخدام جداً. أطفالي يحبون صنع مشروباتهم الغازية الخاصة. أفضل شراء على الإطلاق!",
            date: "قبل أسبوعين"
          },
          ahmed: {
            name: "أحمد حسن",
            location: "جدة، المملكة العربية السعودية",
            review: "مثالية لاستضافة الحفلات! الجميع مندهش من جودة المشروبات الغازية التي يمكننا صنعها في المنزل. برنامج تبادل ثاني أكسيد الكربون مريح جداً وفعال من حيث التكلفة.",
            date: "قبل شهر"
          },
          fatima: {
            name: "فاطمة الزهراء",
            location: "الدمام، المملكة العربية السعودية",
            review: "النكهات الإيطالية عالية الجودة إلهية تماماً! جربت جميع النكهات الـ 22 وكل واحدة أفضل من السابقة. الآلة متينة وخدمة العملاء استثنائية.",
            date: "قبل 3 أسابيع"
          },
          omar: {
            name: "عمر خليل",
            location: "أبها، المملكة العربية السعودية",
            review: "استثمار رائع للأشخاص المهتمين بالصحة. قللنا من استهلاك الصودا بشكل كبير والآن نستمتع بالمشروبات الغازية الطبيعية. طقم البداية كان مثالياً للمبتدئين.",
            date: "قبل شهر"
          },
          layla: {
            name: "ليلى الرشيد",
            location: "تبوك، المملكة العربية السعودية",
            review: "باقة العائلة قيمة مذهلة! نستخدمها يومياً والجودة لا تخيب أبداً. الآلة مصممة لتدوم والنكهات بجودة المطاعم. أوصي بها بشدة!",
            date: "قبل شهرين"
          },
          youssef: {
            name: "يوسف المحمود",
            location: "الخبر، المملكة العربية السعودية",
            review: "منتج وخدمة ممتازة! أسطوانات ثاني أكسيد الكربون تدوم أطول من المتوقع والنكهات إيطالية أصيلة. مثالي لصنع الكوكتيلات والمشروبات المنعشة في المنزل.",
            date: "قبل 3 أسابيع"
          }
        }
      },
      promotional: {
        limitedTimeOffer: "عرض لفترة محدودة",
        saveUpTo: "وفر حتى",
        selectedItems: "على العناصر المختارة",
        dontMissOut: "لا تفوت هذه العروض المذهلة - تسوق الآن قبل أن تنتهي!",
        shopDeals: "🚀 تسوق العروض",
        shopNow: "تسوق الآن",
        limitedTimeOfferText: "عرض لفترة محدودة"
      },
      productDetail: {
        breadcrumb: {
          shop: "المتجر",
          category: "فئة المنتج",
          product: "اسم المنتج"
        },
        badges: {
          new: "جديد",
          popular: "شائع",
          discount: "خصم",
          lowStock: "المخزون منخفض"
        },
        imageCounter: {
          of: "من"
        },
        rating: {
          outOf5: "5 من 5",
          reviews: "تقييمات",
          verifiedPurchase: "تم الشراء بالفعل",
          basedOn: "مبني على",
          verifiedReviews: "تقييمات موثقة",
          helpful: "مفيد",
          reply: "رد"
        },
        options: {
          availableColors: "الألوان المتاحة",
          availableSizes: "الأحجام المتاحة",
          quantity: "الكمية"
        },
        actions: {
          addToCart: "أضف إلى السلة",
          outOfStock: "نفذت الكمية",
          addToWishlist: "أضف إلى المفضلة",
          addBundleToCart: "أضف الحزمة للسلة",
          addedToCart: "تمت الإضافة إلى السلة",
          removeFromWishlist: "إزالة من المفضلة"
        },
        features: {
          keyFeatures: "ميزات المنتج",
          bundleBenefits: "فوائد الحزمة",
          whatsIncluded: "ما يشمل"
        },
        trust: {
          freeShipping: "شحن مجاني",
          warranty: "ضمان",
          easyReturns: "إرجاع سهل",
          twoYearWarranty: "ضمان سنتين"
        },
        tabs: {
          productInformation: "معلومات المنتج",
          completeDetails: "التفاصيل الكاملة",
          productDescription: "وصف المنتج",
          technicalSpecifications: "التفاصيل الفنية",
          customerReviews: "تقييمات العملاء",
          bundleSpecifications: "التفاصيل المتعلقة بالحزمة",
          outOf5: "من 5",
          basedOn: "بناءً على",
          verified: "موثق"
        },
        related: {
          youMightAlsoLike: "ربما تحب أيضاً",
          products: {
            drinkmateRed: "درينك ميت - آلة أومني فيز - حمراء",
            co2Cylinder: "أسطوانة ثاني أكسيد الكربون 60 لتر",
            strawberryLemon: "شراب الفراولة والليمون الإيطالي"
          },
          categories: {
            sodaMakers: "صانعات الصودا",
            co2: "ثاني أكسيد الكربون",
            italianFlavors: "النكهات الإيطالية"
          }
        },
        products: {
          names: {
            drinkmateRed: "درينك ميت - آلة أومني فيز - حمراء",
            drinkmateBlue: "درينك ميت - آلة أومني فيز - زرقاء",
            drinkmateBlack: "درينك ميت - آلة أومني فيز - سوداء",
            co2Cylinder: "أسطوانة ثاني أكسيد الكربون 60 لتر",
            strawberryLemonSyrup: "شراب الفراولة والليمون الإيطالي",
            premiumFlavorsPack: "باقة النكهات الإيطالية المميزة",
            bottlesSet: "طقم زجاجات درينك ميت",
            energyColaFlavors: "نكهات الكولا المنشطة"
          },
          categories: {
            sodaMakers: "صانعات الصودا",
            co2: "ثاني أكسيد الكربون",
            italianFlavors: "النكهات الإيطالية",
            accessories: "الملحقات"
          },
          descriptions: {
            drinkmateRed: "درينك ميت أومني فيز الحمراء هي صانعة صودا ثورية تسمح لك بإضافة الغاز لأي سائل، وليس فقط الماء. من العصير والشاي المثلج إلى النبيذ والكوكتيلات، الاحتمالات لا تنتهي. هذا النموذج الأحمر المميز يجمع بين الأناقة والوظائف، ويتميز بتقنية إضافة الغاز المتقدمة وتصميم أنيق يكمل أي مطبخ.",
            drinkmateBlue: "يقدم درينك ميت أومني فيز الأزرق نفس تقنية إضافة الغاز الثورية في لون أزرق مذهل. مثالي لأولئك الذين يفضلون الجمالية الأكثر برودة وعصرية مع الاستمتاع بجميع فوائد صنع الصودا بجودة احترافية في المنزل.",
            drinkmateBlack: "يجمع درينك ميت أومني فيز الأسود بين الأناقة والوظائف. هذا النموذج الأسود الأنيق يقدم نفس تقنية إضافة الغاز المتقدمة في تصميم متطور يناسب تماماً أي مطبخ عصري.",
            co2Cylinder: "أسطوانة ثاني أكسيد كربون عالية الجودة توفر حتى 60 لتر من المشروبات الغازية. متوافقة مع جميع آلات درينك ميت ومصممة للتشغيل الآمن والموثوق. مثالية للاستخدام المنزلي والاجتماعات الصغيرة.",
            strawberryLemonSyrup: "شراب الفراولة والليمون الإيطالي الأصيل المصنوع من مكونات مميزة. هذا المزيج اللذيذ يخلق مشروب غازي منعش وفواكه مثالي لأي مناسبة. مصنوع في إيطاليا باستخدام وصفات تقليدية.",
            premiumFlavorsPack: "مجموعة مميزة من الشرابات الإيطالية الأصيلة التي تتميز بأفضل النكهات من إيطاليا. تتضمن هذه الباقة مجموعة متنوعة من النكهات الكلاسيكية والغريبة، مثالية لإنشاء مشروبات غازية بجودة المطاعم في المنزل.",
            bottlesSet: "طقم كامل من الزجاجات عالية الجودة المصممة خصيصاً لآلات درينك ميت. هذه الزجاجات مصنوعة من مواد آمنة للأغذية وتتميز بختم آمن للحفاظ على الغاز. مثالية لتخزين وتقديم مشروباتك الغازية محلية الصنع.",
            energyColaFlavors: "نكهة كولا منشطة مع لمسة فريدة. هذا الشراب مستوحى من الكولا الإيطالية يجمع بين طعم الكولا الكلاسيكي والمكونات الطبيعية المعززة للطاقة، مما يخلق مشروب غازي منعش ومنشط."
          },
          specifications: {
            dimensions: "الأبعاد",
            weight: "الوزن",
            material: "المادة",
            powerSource: "مصدر الطاقة",
            capacity: "السعة",
            co2Compatibility: "توافق ثاني أكسيد الكربون",
            warranty: "الضمان",
            countryOfOrigin: "بلد المنشأ",
            volume: "الحجم",
            ingredients: "المكونات",
            origin: "المنشأ",
            allergens: "مسببات الحساسية",
            shelfLife: "مدة الصلاحية",
            storage: "التخزين",
            serving: "الخدمة",
            certification: "الشهادة",
            contents: "المحتويات",
            totalVolume: "الحجم الإجمالي",
            sealType: "نوع الختم",
            dishwasherSafe: "آمن لغسالة الصحون",
            bpaFree: "خالي من BPA",
            safety: "السلامة",
            compatibility: "التوافق",
            refillable: "قابل لإعادة الملء"
          },
          specificationValues: {
            dimensions: "12.5\" × 8.5\" × 15.5\"",
            weight: "4.2 رطل",
            material: "بلاستيك آمن للأغذية وفولاذ مقاوم للصدأ",
            powerSource: "تشغيل يدوي",
            capacity: "زجاجات 1 لتر",
            co2Compatibility: "أسطوانات 60 لتر قياسية",
            warranty: "ضمان محدود لمدة عامين",
            countryOfOrigin: "إيطاليا",
            volume: "500 مل",
            ingredients: "فراولة طبيعية، ليمون، سكر، ماء",
            origin: "إيطاليا",
            allergens: "لا شيء",
            shelfLife: "24 شهراً غير مفتوح",
            storage: "تخزين في مكان بارد وجاف",
            serving: "يصنع 10-15 مشروب",
            certification: "حلال معتمد",
            contents: "4 زجاجات مع أغطية",
            totalVolume: "4 لترات",
            sealType: "غطاء برغي مع حشية",
            dishwasherSafe: "نعم",
            bpaFree: "نعم",
            safety: "صمام أمان مدمج",
            compatibility: "جميع آلات درينك ميت",
            refillable: "نعم، من خلال برنامج التبادل"
          },
          features: {
            carbonatesAnyLiquid: "يضيف الغاز لأي سائل في ثوانٍ",
            advancedPressureRelease: "نظام إطلاق الضغط المتقدم",
            ergonomicDesign: "تصميم مريح للاستخدام السهل",
            foodGradeMaterials: "مواد آمنة للأغذية للسلامة",
            compatibleWithCo2: "متوافق مع جميع أسطوانات ثاني أكسيد الكربون القياسية",
            easyToClean: "مكونات سهلة التنظيف",
            portableLightweight: "محمولة وخفيفة الوزن",
            noElectricityRequired: "لا تحتاج كهرباء",
            highGradeSteel: "بناء من الفولاذ عالي الجودة",
            builtInSafetyValve: "صمام أمان مدمج",
            refillableExchange: "قابلة لإعادة الملء من خلال برنامج التبادل",
            longLastingPerformance: "أداء طويل الأمد",
            authenticItalianRecipe: "وصفة إيطالية أصلية",
            naturalIngredients: "مكونات طبيعية",
            perfectBalance: "توازن مثالي بين الفراولة والليمون",
            makesDrinks: "يصنع 10-15 مشروب منعش",
            halalCertified: "حلال معتمد",
            longShelfLife: "مدة صلاحية طويلة",
            noArtificialPreservatives: "لا تحتوي على مواد حافظة اصطناعية",
            versatileDrinks: "متعددة الاستخدامات لمشروبات مختلفة",
            premiumCollection: "8 شرابات إيطالية مميزة",
            varietyFlavors: "تنوع في النكهات الكلاسيكية",
            restaurantQuality: "طعم بجودة المطاعم",
            greatValuePack: "باقة قيمة ممتازة",
            completeSet: "4 زجاجات مع أغطية آمنة",
            secureSeal: "ختم آمن يحافظ على الغاز",
            perfectStorage: "مثالية للتخزين والتقديم",
            classicCola: "طعم الكولا الكلاسيكي",
            naturalEnergy: "تعزيز طبيعي للطاقة",
            refreshingTaste: "طعم منعش"
          },
          colors: {
            red: "أحمر",
            blue: "أزرق",
            black: "أسود",
            silver: "فضي",
            clear: "شفاف",
            brown: "بني",
            mixed: "مختلط"
          },
          sizes: {
            standard: "قياسي",
            sixtyLiters: "60 لتر",
            fiveHundredMl: "500 مل",
            oneLiterX4: "1 لتر × 4",
            eightX500ml: "8×500 مل"
          },
          currency: {
            sar: "ريال",
            save: "وفر"
          },
          reviews: {
            sarahAlMansouri: "سارة المنصوري",
            ahmedHassan: "أحمد حسن",
            fatimaZahra: "فاطمة الزهراء",
            riyadhSaudiArabia: "الرياض، المملكة العربية السعودية",
            jeddahSaudiArabia: "جدة، المملكة العربية السعودية",
            dammamSaudiArabia: "الدمام، المملكة العربية السعودية",
            twoWeeksAgo: "قبل أسبوعين",
            oneMonthAgo: "قبل شهر",
            threeWeeksAgo: "قبل 3 أسابيع",
            sarahReview: "أحب آلة درينك ميت أومني فيز! النكهات الإيطالية مذهلة والآلة سهلة الاستخدام جداً. أطفالي يحبون صنع مشروباتهم الغازية الخاصة. أفضل شراء على الإطلاق!",
            ahmedReview: "مثالية لاستضافة الحفلات! الجميع مندهش من جودة المشروبات الغازية التي يمكننا صنعها في المنزل. برنامج تبادل ثاني أكسيد الكربون مريح جداً وفعال من حيث التكلفة.",
            fatimaReview: "آلة رائعة بشكل عام! اللون الأحمر جميل وتعمل بشكل مثالي. أعطي 4 نجوم فقط لأن دليل التعليمات يمكن أن يكون أوضح للمستخدمين لأول مرة."
          }
        },
        bundleDetail: {
          whatsIncluded: "ما يشمل",
          quantity: "الكمية",
          addBundleToCart: "أضف الحزمة إلى السلة",
          addToWishlist: "أضف إلى قائمة الأمنيات",
          bundleBenefits: "فوائد الحزمة",
          bundleSpecifications: "تفاصيل الحزمة",
          save: "وفر",
          bundles: "الباقات",
          mostPopular: "الأكثر شعبية",
          addedToCart: "تمت الإضافة إلى السلة",
          removeFromWishlist: "إزالة من قائمة الأمنيات",
          addedToWishlist: "تمت الإضافة إلى قائمة الأمنيات",
          familyBundle: {
            title: "إعداد كامل للعائلة مع نكهات متعددة",
            description: "باقة عائلية مثالية مع كل ما تحتاجه لبدء صنع المشروبات الغازية في المنزل",
            items: "x1 صانعة صودا، x2 أسطوانة و x5 Flavors",
            features: [
              "إعداد كامل لصانعة الصودا",
              "أسطوانات ثاني أكسيد كربون متعددة للاستخدام الممتد",
              "تنوع في النكهات الإيطالية المميزة",
              "مثالية للاجتماعات العائلية",
              "قيمة ممتازة مقابل المال",
              "سهلة الاستخدام والصيانة"
            ],
            specifications: {
              "صانعة الصودا": "درينك ميت أومني فيز (أزرق)",
              "أسطوانات ثاني أكسيد الكربون": "2x أسطوانة 60 لتر",
              "النكهات المدرجة": "5 شراب إيطالي مميز",
              "القيمة الإجمالية": "999.00 ريال سعودي",
              "توفير الباقة": "200.00 ريال سعودي",
              "الضمان": "سنتان على الآلة، سنة واحدة على الملحقات"
            }
          },
          starterBundle: {
            title: "طقم البداية",
            description: "طقم مثالي لأولئك الذين يستخدمون الآلة لأول مرة",
            items: "x1 صانعة صودا، x1 أسطوانة و x2 نكهات",
            features: [
              "إعداد كامل للمبتدئين",
              "مثالي للمبتدئين",
              "نكهتان إيطاليتان مميزتان مدرجتان",
              "سهل الاستخدام والصيانة",
              "قيمة ممتازة مقابل المال",
              "كل ما تحتاجه للبدء"
            ],
            specifications: {
              "صانعة الصودا": "درينك ميت أومني فيز (هيرو)",
              "أسطوانات ثاني أكسيد الكربون": "1x أسطوانة 60 لتر",
              "النكهات المدرجة": "2 شراب إيطالي مميز",
              "القيمة الإجمالية": "899.00 ريال سعودي",
              "توفير الباقة": "100.00 ريال سعودي",
              "الضمان": "سنتان على الآلة، سنة واحدة على الملحقات"
            }
          },
          premiumBundle: {
            title: "الباقة المميزة",
            description: "تجربة فاخرة مع نكهات إيطالية مميزة",
            items: "x1 صانعة صودا، x1 أسطوانة و x8 نكهات مميزة",
            features: [
              "إعداد صانعة صودا مميزة",
              "8 نكهات إيطالية مميزة",
              "تجربة فاخرة",
              "مثالية للترفيه",
              "نكهات بجودة المطاعم",
              "باقة القيمة القصوى"
            ],
            specifications: {
              "صانعة الصودا": "درينك ميت أومني فيز (حمراء)",
              "أسطوانات ثاني أكسيد الكربون": "1x أسطوانة 60 لتر",
              "النكهات المدرجة": "8 شراب إيطالي مميز",
              "القيمة الإجمالية": "1,499.00 ريال سعودي",
              "توفير الباقة": "200.00 ريال سعودي",
              "الضمان": "سنتان على الآلة، سنة واحدة على الملحقات"
            }
          },
          features: {
            completeSetup: "إعداد كامل لصانعة الصودا",
            multipleCylinders: "أسطوانات ثاني أكسيد كربون متعددة للاستخدام الممتد",
            varietyFlavors: "تنوع في النكهات الإيطالية المميزة",
            familyGatherings: "مثالية للاجتماعات العائلية",
            greatValue: "قيمة ممتازة مقابل المال",
            easyUse: "سهلة الاستخدام والصيانة"
          },
          specifications: {
            sodaMaker: "صانعة الصودا",
            co2Cylinders: "أسطوانات ثاني أكسيد الكربون",
            flavorsIncluded: "النكهات المدرجة",
            totalValue: "القيمة الإجمالية",
            bundleSavings: "توفير الباقة",
            warranty: "الضمان",
            // Starter bundle specific values
            starterSodaMaker: "درينك ميت أومني فيز (هيرو)",
            starterCo2Cylinders: "أسطوانة 1× 60 لتر",
            starterFlavors: "2 شراب إيطالي عالي الجودة",
            starterTotalValue: "899.00 ريال",
            starterBundleSavings: "100.00 ريال",
            starterWarranty: "سنتان على الآلة، سنة واحدة على الملحقات",
            // Family bundle specific values
            familySodaMaker: "درينك ميت أومني فيز (أزرق)",
            familyCo2Cylinders: "أسطوانتان 2× 60 لتر",
            familyFlavors: "5 شراب إيطالي عالي الجودة",
            familyTotalValue: "1,199.00 ريال",
            familyBundleSavings: "200.00 ريال",
            familyWarranty: "سنتان على الآلة، سنة واحدة على الملحقات",
            // Premium bundle specific values
            premiumSodaMaker: "درينك ميت أومني فيز (أحمر)",
            premiumCo2Cylinders: "أسطوانة 1× 60 لتر",
            premiumFlavors: "8 شراب إيطالي عالي الجودة",
            premiumTotalValue: "1,499.00 ريال",
            premiumBundleSavings: "200.00 ريال",
            premiumWarranty: "سنتان على الآلة، سنة واحدة على الملحقات"
          }
        }
      }
    },

    blog: {
      hero: {
        title: "المدونة والأخبار",
        subtitle: "ابق محدثاً",
        description: "اكتشف أحدث الأخبار والنصائح والرؤى حول منتجات درينك ميت وعالم المشروبات الغازية."
      },
      featuredPost: {
        title: "المقال المميز",
        readMore: "اقرأ المزيد",
        publishedOn: "نشر في",
        author: "بواسطة",
        category: "الفئة"
      },
      categories: {
        all: "الكل",
        news: "الأخبار",
        tips: "النصائح والحيل",
        recipes: "الوصفات",
        company: "الشركة",
        science: "العلوم",
        guide: "الدليل",
        products: "المنتجات",
        environment: "البيئة",
        health: "الصحة",
        lifestyle: "نمط الحياة"
      },
      search: {
        placeholder: "البحث في المقالات...",
        searchButton: "بحث"
      },
      newsletter: {
        title: "ابق محدثاً",
        description: "احصل على أحدث المقالات والأخبار في بريدك الإلكتروني",
        emailPlaceholder: "أدخل بريدك الإلكتروني",
        subscribe: "اشتراك"
      },
      pagination: {
        previous: "السابق",
        next: "التالي",
        page: "الصفحة",
        of: "من"
      },
      blogPosts: {
        readTime: "دقائق للقراءة",
        publishedOn: "نُشر في",
        author: "الكاتب",
        category: "الفئة",
        backToBlog: "العودة إلى المدونة",
        shareThisPost: "شارك هذا المنشور",
        relatedPosts: "منشورات ذات صلة",
        tags: "العلامات",
        comments: "التعليقات",
        leaveComment: "اترك تعليقاً",
        commentPlaceholder: "اكتب تعليقك هنا...",
        postComment: "نشر التعليق",
        likePost: "إعجاب",
        likedPost: "أعجبني",
        // Blog post content translations
        postTitles: {
          post1: "10 وصفات مشروبات منعشة للصيف مع درينك ميت",
          post2: "العلم وراء التكربن المثالي",
          post3: "كيف تختار أسطوانة ثاني أكسيد الكربون المثالية لدرينك ميت",
          post4: "أفضل 5 شرابات إيطالية فاخرة لدرينك ميت",
          post5: "التأثير البيئي: كيف يقلل درينك ميت من النفايات البلاستيكية",
          post6: "الفوائد الصحية للمياه الغازية: الخرافات مقابل الحقائق",
          post7: "كيف تستضيف حفلة التكربن المثالية مع درينك ميت"
        },
        postExcerpts: {
          post1: "تغلب على حرارة الصيف مع وصفات المشروبات الغازية اللذيذة والسهلة الصنع باستخدام آلة درينك ميت.",
          post2: "تعلم عن كيمياء التكربن وكيف تنشئ تقنية درينك ميت الفقاعات المثالية في كل مرة.",
          post3: "تعلم كيف تختار الحجم المثالي لأسطوانة ثاني أكسيد الكربون لآلة درينك ميت بناءً على الاستخدام والتكلفة والراحة.",
          post4: "اكتشف أفضل 5 شرابات إيطالية فاخرة ستغير مشروبات درينك ميت إلى متعة إيطالية أصيلة.",
          post5: "اكتشف كيف تساعد آلة درينك ميت في تقليل النفايات البلاستيكية وحماية البيئة مع توفير المال.",
          post6: "اكتشف الحقيقة حول الفوائد الصحية للمياه الغازية ودحض الخرافات الشائعة بالأدلة العلمية.",
          post7: "تعلم كيف تستضيف حفلة تكربن لا تُنسى ستعرض آلة درينك ميت وتثير إعجاب ضيوفك."
        },
        postAuthors: {
          drinkmateTeam: "فريق درينك ميت",
          ahmedHassan: "د. أحمد حسن",
          sarahJohnson: "د. سارة جونسون",
          environmentalTeam: "فريق البيئة"
        },
        postDates: {
          jan15: "15 يناير 2024",
          jan12: "12 يناير 2024",
          jan10: "10 يناير 2024",
          jan8: "8 يناير 2024",
          jan5: "5 يناير 2024",
          jan3: "3 يناير 2024",
          dec30: "30 ديسمبر 2023"
        },
        post1: {
          title: "10 وصفات مشروبات منعشة للصيف مع درينك ميت",
          subtitle: "تغلب على حرارة الصيف مع المشروبات الغازية محلية الصنع!",
          intro: "الصيف هنا، وما أفضل طريقة للتغلب على الحرارة من المشروبات الغازية المنعشة محلية الصنع؟ تجعل آلة درينك ميت من السهل جداً إنشاء مشروبات لذيذة ليست فقط طيبة المذاق ولكن أيضاً أكثر صحة من البدائل التي تباع في المتاجر. قل وداعاً للنكهات الاصطناعية ومرحباً بالمنعشات الطبيعية والقابلة للتخصيص!",
          whyMake: {
            title: "لماذا تصنع مشروباتك الغازية الخاصة؟",
            health: {
              title: "الفوائد الصحية",
              benefit1: "لا توجد مواد حافظة أو ألوان اصطناعية",
              benefit2: "التحكم في مستويات الحلاوة",
              benefit3: "مكونات طبيعية فقط",
              benefit4: "محتوى سكر أقل"
            },
            cost: {
              title: "توفير التكلفة",
              saving1: "أرخص بنسبة 70% من المشترى من المتجر",
              saving2: "زجاجات قابلة لإعادة الاستخدام",
              saving3: "شراء المكونات بكميات كبيرة",
              saving4: "لا توجد تكاليف نقل"
            }
          },
          excerpt: "تغلب على حرارة الصيف مع وصفات المشروبات الغازية اللذيذة والسهلة الصنع باستخدام آلة درينك ميت.",
          author: "فريق درينك ميت",
          date: "15 يناير 2024",
          tags: {
            recipes: "الوصفات",
            summer: "الصيف",
            refreshing: "منعش",
            healthy: "صحي",
            sparkling: "غازي"
          }
        },
        post2: {
          title: "العلم وراء التكربن المثالي",
          content: "محتوى للمنشور العلمي...",
          excerpt: "تعلم عن كيمياء التكربن وكيف تنشئ تقنية درينك ميت الفقاعات المثالية في كل مرة.",
          author: "د. أحمد حسن",
          date: "12 يناير 2024",
          tags: {
            science: "العلم",
            chemistry: "الكيمياء",
            carbonation: "التكربن",
            technology: "التقنية"
          }
        },
        post3: {
          title: "كيف تختار أسطوانة ثاني أكسيد الكربون المثالية لدرينك ميت",
          content: "محتوى لمنشور الدليل...",
          excerpt: "تعلم كيف تختار الحجم المثالي لأسطوانة ثاني أكسيد الكربون لآلة درينك ميت بناءً على الاستخدام والتكلفة والراحة.",
          author: "فريق درينك ميت",
          date: "10 يناير 2024",
          tags: {
            guide: "الدليل",
            co2: "ثاني أكسيد الكربون",
            equipment: "المعدات",
            tips: "النصائح"
          }
        },
        post4: {
          title: "أفضل 5 شرابات إيطالية فاخرة لدرينك ميت",
          content: "محتوى لمنشور المنتجات...",
          excerpt: "اكتشف أفضل 5 شرابات إيطالية فاخرة ستغير مشروبات درينك ميت إلى متعة إيطالية أصيلة.",
          author: "فريق درينك ميت",
          date: "8 يناير 2024",
          tags: {
            products: "المنتجات",
            italian: "إيطالي",
            syrups: "الشرابات",
            premium: "فاخر"
          }
        },
        post5: {
          title: "التأثير البيئي: كيف يقلل درينك ميت من النفايات البلاستيكية",
          content: "محتوى لمنشور البيئة...",
          excerpt: "اكتشف كيف تساعد آلة درينك ميت في تقليل النفايات البلاستيكية وحماية البيئة مع توفير المال.",
          author: "فريق البيئة",
          date: "5 يناير 2024",
          tags: {
            environment: "البيئة",
            plastic: "البلاستيك",
            sustainability: "الاستدامة",
            green: "أخضر"
          }
        },
        post6: {
          title: "الفوائد الصحية للمياه الغازية: الخرافات مقابل الحقائق",
          content: "محتوى لمنشور الصحة...",
          excerpt: "اكتشف الحقيقة حول الفوائد الصحية للمياه الغازية ودحض الخرافات الشائعة بالأدلة العلمية.",
          author: "د. سارة جونسون",
          date: "3 يناير 2024",
          tags: {
            health: "الصحة",
            benefits: "الفوائد",
            myths: "الخرافات",
            science: "العلم"
          }
        },
        post7: {
          title: "كيف تستضيف حفلة التكربن المثالية مع درينك ميت",
          content: "محتوى لمنشور نمط الحياة...",
          excerpt: "تعلم كيف تستضيف حفلة تكربن لا تُنسى ستعرض آلة درينك ميت وتثير إعجاب ضيوفك.",
          author: "فريق درينك ميت",
          date: "30 ديسمبر 2023",
          tags: {
            party: "الحفلة",
            entertainment: "الترفيه",
            social: "اجتماعي",
            lifestyle: "نمط الحياة",
            carbonation: "التكربن"
          }
        },
        authorBio: {
          team: "فريقنا الخبير من عشاق المشروبات ومتخصصي التكربن الذين يهتمون بمساعدتك في إنشاء المشروبات الغازية المثالية في المنزل.",
          expert: "خبير متحمس في مجاله، مكرس لمشاركة المعرفة والرؤى حول تقنية التكربن وعلوم المشروبات."
        }
      }
    },
    privacyPolicy: {
      hero: {
        title: "سياسة الخصوصية",
        subtitle: "كيف نحمي معلوماتك",
        lastUpdated: "تاريخ السريان: سبتمبر 2022"
      },
      sections: {
        introduction: {
          title: "المقدمة",
          p1: "يرجى قراءة سياسة الخصوصية هذه بعناية قبل دخولك واستخدامك منصة \"Drinkmate\".",
          p2: "نحن نقدر اهتمامكم ومخاوفكم بشأن خصوصية بياناتكم على شبكة الإنترنت، لذا قمنا بإعداد هذه السياسة لمساعدتكم على فهم طبيعة جمع واستخدام ومشاركة البيانات الشخصية وكيفية التعامل معها عند زيارة منصة \"Drinkmate\". تنطبق هذه السياسة على كافة استخداماتك لمنصة \"Drinkmate\" بما في ذلك المعلومات والبيانات والخدمات والأدوات وجميع الصفحات والأنشطة الأخرى التي نقدمها على المنصة أو من خلالها أو عندما تتفاعل معنا بطريقة أخرى، ولا تنطبق هذه السياسة على أي مواقع أو تطبيقات أو خدمات أخرى لجهات خارجية ترتبط بمنصة \"Drinkmate\".",
          p3: "أنت تقر بأنّ استخدامك لمنصة \"Drinkmate\" يعني أنك قرأت وفهمت هذه السياسة وملم بكافة الأحكام والممارسات المعلنة فيها."
        },
        dataCollection: {
          title: "جمع البيانات",
          intro: "قد نقوم بجمع بعض البيانات عنك، والتي تشمل على سبيل المثال:",
          items: [
            "بيانات الحساب، مثل الاسم ورقم الجوال وعنوان البريد الإلكتروني.",
            "بيانات تسجيل الدخول إلى الحساب: مثل معرّف تسجيل الدخول أو كلمة المرور أو رموز الأمان الأخرى.",
            "بيانات الدفع: مثل رقم بطاقة الائتمان الخاصة بك واسم حامل البطاقة وتاريخ انتهاء الصلاحية ورمز المصادقة وعنوان الفوترة.",
            "البيانات التقنية وتتضمن عناوين بروتوكول الإنترنت (IP) المستخدم لربط جهازك الخاص بشبكة الإنترنت، واسم وموقع الجهاز، ونوع نظام التشغيل، وبيانات شبكة المحمول بما في ذلك رقم الجوال ومعرفات الجهاز، والإصدار وتفضيلات اللغة والمعلومات التي تبحث عنها في المنصة وأوقات الوصول والتواريخ والإحصاءات الأخرى.",
            "بيانات السجل: المعلومات التشخيصية، والتقنية، والأخطاء التشغيلية، والاستخدام مثل توقيت استخدامك للخدمات ومدته، وأي بيانات مُخزنة في ملفات تعريف الارتباط التي قمت بتعيينها على أجهزتك، والصفحات التي زُرتها قبل أو بعد الانتقال إلى المنصة.",
            "بيانات التواصل، مثل الاسم، والبريد الإلكتروني، ورقم الجوال، وعنوان الرسالة، وموضوعها.",
            "الملاحظات، والآراء، والتعليقات المُقدمة على المنصة.",
            "أي بيانات أخرى تقرر مشاركتها طوعًا معنا، بما في ذلك، على سبيل المثال لا الحصر، العنوان، الجنس، البلد، وغيرها من البيانات المشابهة.",
            "البيانات التي زودتنا بها من خلال ملء النماذج المتوفّرة على المنصة أو أي وسيلة أخرى."
          ],
          note: "يجب عليك الالتزام بتقديم معلومات كاملة وصحيحة ودقيقة والالتزام بالحفاظ على سرية معلومات حسابك، وتحديد الأشخاص المسموح لهم بالوصول إلى حسابك واستخدامه، وإلا ستكون مسؤولاً عن أي أضرار تنتج عن عدم دقة هذه المعلومات أو عدم تحديثها بمجرد تغييرها. يجوز لنا مشاركة المعلومات المذكورة مع أطراف ثالثة لغرض تصميم الإعلانات وتحليلها وإدارتها وتقديم التقارير وتحسينها على المنصة."
        },
        limitsOnUse: {
          title: "حدود استخدام بياناتك",
          intro: "نحن ملتزمون دائمًا بحماية خصوصيتك، وبالتالي فنحن نستخدم بياناتك الشخصية للأغراض الآتية:",
          items: [
            "لتسجيل وإدارة حسابك وإرسال رسالة عبر البريد الإلكتروني لتأكيد تسجيلك في المنصة.",
            "لتحديد هويتك عند استخدام المنصة وتزويدك بتجربة مخصصة لك.",
            "لمعالجة الفواتير والدفع، ومشاركة البيانات مع بوابات الدفع.",
            "لتقديم خدمة أفضل، وكذلك تحسين خدماتنا والمنصة.",
            "لتحسين جودة خدمة العملاء، حيث تساعدنا المعلومات الخاصة بك على سهولة الاستجابة لطلباتك الموجهة وتحسين خدمة العملاء واحتياجاتك للدعم بشكل أكثر فاعلية.",
            "للتواصل معك وإرسال رسائل إلكترونية بشكل دوري، والرد على الاستفسارات.",
            "لمنع الأنشطة المحظورة أو غير القانونية، والامتثال للقانون المعمول به، وفرض شروط الخدمة وأي أغراض أخرى تم الكشف عنها لك في الوقت الذي نجمع فيه معلوماتك أو وفقاً لموافقتك.",
            "لحماية هويتك والمعلومات المالية، وتزويدك بأفضل حماية ممكنة من الاحتيال.",
            "لتقديم مقترحات وتوصيات إليك وإلى المستخدمين الآخرين بشأن الخدمات التي قد تهمكم، والتي قد تعتمد على نشاطكم على المنصة.",
            "للأغراض الإحصائية والبحثية والتحليلية والتسويقية والترويجية والدراسات الاستقصائية."
          ]
        },
        dataSharing: {
          title: "مشاركة البيانات",
          intro: "نشارك البيانات الشخصية المجمعة وفقاً لهذه السياسة مع الشركات التابعة لنا ومع الأطراف الثالثة الأخرى التي قد تكون ضرورية لتحقيق الأغراض المنصوص عليها في القسم 3 من هذه السياسة، وعليه أنت تقر وتوافق بأنه يحق لنا مشاركة بياناتك الشخصية على النحو التالي:",
          items: [
            "للامتثال للإجراءات القانونية أو للامتثال لأوامر الاستدعاء الشرعية أو القابلة للتنفيذ أو أوامر المحكمة.",
            "للاستجابة للطلبات المقدمة من السلطات العامة والحكومية.",
            "لتنفيذ شروط الاستخدام وسياسة الخصوصية الخاصة بنا.",
            "لحماية حقوقنا وخصوصيتنا وسلامتنا وممتلكاتنا و/أو حقوقك أو الآخرين.",
            "يجوز لنا مشاركة المعلومات مع موردي الطرف الثالث الذين يقدمون خدمات أو وظائف نيابة عنا، بما في ذلك تحليلات الأعمال، ومعالجة المدفوعات، وخدمة العملاء، والتسويق، والعلاقات العامة، وتوزيع الاستطلاعات، ومنع الاحتيال. قد نأذن أيضاً لمورّدي الجهات الخارجية بتجميع المعلومات نيابة عنا، بما في ذلك، على سبيل المثال، عند الضرورة لتشغيل ميزات المنصة أو لتسهيل تقديم الإعلانات عبر الإنترنت المصممة خصيصاً لمصالحك. يمتلك موردو الجهات الخارجية حق الوصول إلى المعلومات ويجوز لهم جمعها فقط عند الحاجة لأداء وظائفهم.",
            "يجوز لنا أيضاً مشاركة المعلومات مع طرف ثالث فيما يتعلق بأي عملية إعادة تنظيم، أو دمج، أو بيع، أو مشروع مشترك، أو تنازل، أو تحويل، أو أي تصرف آخر لكل أو جزء من أعمالنا أو أصولنا أثناء المفاوضات."
          ]
        },
        dataStorage: {
          title: "تخزين البيانات",
          p1: "نحن في منصة \"Drinkmate\" نقوم فقط بتخزين بياناتك الشخصية طالما أنها ضرورية لتحقيق الأغراض المحددة في القسم 3، كما أننا نحتفظ بالحق في إعادة النظر في شروط الخصوصية الحالية، وعليك بمراجعة هذه السياسة من وقت لآخر."
        },
        dataProtection: {
          title: "حماية وأمن البيانات",
          intro: "نتخذ إجراءات أمنية تقنية وتنظيمية لحماية بياناتك من الضياع وسوء الاستخدام والوصول غير المصرح به أو الكشف أو التغيير أو الإتلاف، وتشمل بعض الإجراءات الوقائية التي نستخدمها جدران الحماية، وتشفير البيانات، وعناصر التحكم في الوصول المادي إلى مراكز البيانات لدينا وعناصر التحكم في إذن الوصول إلى البيانات.",
          items: [
            "لن نقوم بتأجير أو بيع بياناتك إلى أي أطراف خارجية، ولن نسمح للغير باستخدامها لأغراض التسويق المباشر أو غير المباشر دون الحصول على موافقتك.",
            "يجوز لنا جمع معلوماتك واستخدامها وحفظها ومشاركتها إذا رأينا ضرورة في ذلك بهدف: الاستجابة للقوانين، أو للوائح السارية، أو للإجراءات القانونية، أو للطلبات الحكومية؛ تنفيذ شروطنا وأي شروط وسياسات سارية أخرى، بما في ذلك لأغراض التحقيقات في المخالفات المحتملة؛ كشف ومنع حالات التزوير والمسائل الأمنية والقانونية والأعطال التقنية بالإضافة إلى التعامل معها والتحقيق فيها؛ حماية حقوق، أو ملكية، أو أمان مستخدمينا، أو منصة \"Drinkmate\"."
          ],
          note: "من الممكن ألا يكون هذا المستوى من الحماية فعال بنسبة 100% إلا إذا كنت تتبع سياسات أمنية خاصة بك. يجب عليك ألا تشارك بيانات حسابك مع أي شخص، وإذا كنت تشعر بالقلق بأن أي من بياناتك الشخصية قد كشفت، يجب عليك تغييرها على الفور بعد تسجيل الدخول على حسابك."
        },
        compliance: {
          title: "الامتثال والتعاون مع الجهات التنظيمية",
          p1: "نحن نراجع بانتظام التزامنا بسياسة الخصوصية الخاص بنا، وعندما نتلقى شكاوى رسمية مكتوبة، فإننا نتّصل بالشخص الذي قدم الشكوى للمتابعة، وكذلك نعمل مع الجهات التنظيمية المعنيّة، بما فيها جهات حماية البيانات المحلية، لحل أيّ شكاوى تتعلق بنقل البيانات الشخصيّة التي لا يمكننا حلّها مع مستخدمينا مباشرةً."
        },
        yourResponsibilities: {
          title: "مسؤولياتك",
          p1: "أنت المسؤول عن التأكد من أن البيانات التي تقدمها لنا بيانات دقيقة وكاملة ومحدّثة.",
          p2: "في حال شاركت أيّ بيانات تخص أشخاص آخرين معنا، فأنت المسؤول عن تلك البيانات طبقاً للمتطلبات القانونية، ويجب عليك إعلام هؤلاء الأشخاص الذين زودتنا ببياناتهم عن محتوى هذه السياسة والحصول على موافقتهم المسبقة."
        },
        thirdPartyLinks: {
          title: "روابط الأطراف الخارجية",
          p1: "قد تحتوي منصة \"Drinkmate\" على روابط تحيل المستخدم أو الزائر إلى تطبيقات أو روابط أو مواقع إلكترونية خارجية والتي من شأنها أن تقوم بجمع معلومات عنك والإفصاح عنها بطريقة مختلفة عن المنصة.",
          p2: "لا تتحكم منصة \"Drinkmate\" في ممارسات الخصوصية للتطبيقات والمواقع الخارجية، ولسنا مسؤولين عن المحتوى أو سياسات الخصوصية لتلك التطبيقات والمواقع الخارجية.",
          p3: "يجب عليك مراجعة سياسة الخصوصية وشروط الاستخدام الخاصة بالطرف الثالث عند زيارة أي من هذه التطبيقات أو المواقع الخارجية.",
          p4: "نحن غير مسؤولين عن جمع أو استخدام أو الإفصاح عن أية معلومات من الأطراف الخارجية التي لديها رابط في منصة \"Drinkmate\"."
        },
        childrenPrivacy: {
          title: "خصوصية الأطفال",
          p1: "تعتبر إرشاداتك ومشاركتك ضرورية للمساعدة في ضمان تمتع الأطفال بتجربة آمنة عبر الإنترنت. نحن نشجعك على الاستمرار في المشاركة والاطلاع على ما يقوم به طفلك عبر الإنترنت. وستساعد جهودكم في توجيه أطفالك إلى المواقع التي تناسب أعمارهم.",
          p2: "تتعامل منصة \"Drinkmate\" مع خصوصية الأطفال بجدية. فنحن لا نجمع عمداً المعلومات الشخصية من الأطفال عبر المنصة. وإذا كنت قاصراً بموجب القانون، يرجى عدم إرسال أي معلومات شخصية بدون موافقة صريحة ومشاركة من أحد الوالدين أو الوصي القانوني."
        },
        modifications: {
          title: "التعديلات",
          p1: "تحتفظ منصة \"Drinkmate\" بالحق الكامل في إجراء أي تعديل، أو تغيير، أو إضافة، أو حذف على هذه السياسة وبالكيفية والوقت التي تراه مناسباً، لذا ننصحك بمراجعة هذه الصفحة بشكل دوري وقراءتها بانتظام، وعند نشر أي تغييرات مهمة، سيتم نشرها على هذه الصفحة.",
          p2: "يحق لنا تعديل سياسة الخصوصية الخاصة بنا في أي وقت، وسنقوم بنشر إشعار عام عبر المنصة بالتعديلات الجديدة، كما سنقوم بتحديث \"تاريخ أخر تحديث\" أعلى هذه الوثيقة.",
          p3: "يعد استمرارك في استخدام المنصة بعد تحديث هذه السياسة موافقة صريحة منك على هذه التعديلات وقبولاً قانونيًا منك بالممارسات والأحكام الجديدة. إذا كنت غير موافق على التعديلات والتحديثات الجديدة يجب عليك التوقف فورًا عن استخدام المنصة."
        },
        contactUs: {
          title: "الاتصال بنا",
          intro: "تستطيع في أي وقت الاتصال بنا من خلال:",
          emailLabel: "البريد الإلكتروني:",
          phoneLabel: "رقم الهاتف:",
          email: "cs@drinkmate.sa.com",
          phone: "0544671166",
          acknowledgment: "أنت تٌقر بأنك قد قرأت سياسة الخصوصية هذه وتوافق على جميع بنودها وشروطها.",
          rightsReserved: "جميع الحقوق محفوظة لمنصة Drinkmate 2025"
        }
      }
    },
    termsOfService: {
      hero: {
        title: "شروط الخدمة",
        subtitle: "شروطنا وأحكامنا",
        lastUpdated: "آخر تحديث: يناير 2024"
      },
      sections: {
        acceptance: {
          title: "قبول الشروط",
          description: "باستخدام موقعنا الإلكتروني وخدماتنا، فإنك توافق على هذه الشروط والأحكام."
        },
        services: {
          title: "الخدمات",
          description: "نحن نقدم صانعات الصودا وأسطوانات ثاني أكسيد الكربون والمنتجات والخدمات ذات الصلة.",
          included: [
            "بيع المنتجات والتوصيل",
            "خدمات إعادة ملء وتبادل ثاني أكسيد الكربون",
            "دعم العملاء والضمان",
            "الطلبات عبر الإنترنت والتتبع"
          ]
        },
        userObligations: {
          title: "التزامات المستخدم",
          description: "يجب على المستخدمين الامتثال لجميع القوانين واللوائح المعمول بها.",
          obligations: [
            "تقديم معلومات دقيقة",
            "استخدام المنتجات بأمان وبالطريقة المقصودة",
            "احترام حقوق الملكية الفكرية",
            "الحفاظ على أمان الحساب"
          ]
        },
        payment: {
          title: "شروط الدفع",
          description: "مطلوب الدفع في وقت تقديم الطلب.",
          terms: [
            "جميع الأسعار بالريال السعودي",
            "طرق الدفع المقبولة: بطاقات الائتمان، التحويل المصرفي",
            "يتم معالجة الطلبات بعد تأكيد الدفع",
            "المبالغ المستردة تتم معالجتها خلال 5-7 أيام عمل"
          ]
        },
        shipping: {
          title: "سياسة الشحن",
          description: "نحن نقدم خيارات شحن مختلفة لتلبية احتياجاتك.",
          policies: [
            "شحن مجاني للطلبات فوق 150 ريال",
            "التوصيل القياسي: 3-5 أيام عمل",
            "التوصيل السريع: 1-2 يوم عمل",
            "الاستلام المحلي متاح في الرياض"
          ]
        },
        returns: {
          title: "سياسة الإرجاع",
          description: "نحن نقدم نافذة إرجاع 30 يوماً لمعظم المنتجات.",
          policy: [
            "يجب أن تكون العناصر في حالتها الأصلية",
            "شحن إرجاع مجاني",
            "استرداد كامل أو تبديل",
            "أسطوانات ثاني أكسيد الكربون غير مؤهلة للإرجاع"
          ]
        },
        warranty: {
          title: "الضمان",
          description: "منتجاتنا تأتي مع ضمانات الشركة المصنعة.",
          coverage: [
            "ضمان سنتان على صانعات الصودا",
            "ضمان سنة واحدة على الملحقات",
            "الضمان يغطي عيوب التصنيع",
            "الاستخدام العادي والتآكل غير مغطى"
          ]
        },
        liability: {
          title: "تقييد المسؤولية",
          description: "مسؤوليتنا محدودة إلى الحد الذي يسمح به القانون.",
          limitations: [
            "الحد الأقصى للمسؤولية: سعر شراء المنتج",
            "لا توجد مسؤولية عن الأضرار غير المباشرة",
            "لا توجد مسؤولية عن سوء استخدام المنتجات",
            "أحداث القوة القاهرة مستثناة"
          ]
        },
        termination: {
          title: "إنهاء الخدمة",
          description: "قد ننهي الخدمات لانتهاكات هذه الشروط.",
          conditions: [
            "انتهاك الشروط والأحكام",
            "الأنشطة الاحتيالية أو غير القانونية",
            "عدم دفع الرسوم",
            "إساءة استخدام الخدمات"
          ]
        },
        contact: {
          title: "معلومات الاتصال",
          description: "للأسئلة حول هذه الشروط، يرجى الاتصال بنا.",
          email: "legal@aqualine.sa.com",
          phone: "+966544671166"
        },
        servicesDetails: {
          productSales: "بيع المنتجات والتوصيل",
          co2Services: "خدمات إعادة ملء وتبادل ثاني أكسيد الكربون",
          customerSupport: "دعم العملاء والضمان",
          onlineOrdering: "الطلبات عبر الإنترنت والتتبع"
        },
        obligationsDetails: {
          accurateInfo: "تقديم معلومات دقيقة",
          safeUsage: "استخدام المنتجات بأمان وبالطريقة المقصودة",
          intellectualProperty: "احترام حقوق الملكية الفكرية",
          accountSecurity: "الحفاظ على أمان الحساب"
        },
        paymentDetails: {
          sarPrices: "جميع الأسعار بالريال السعودي",
          paymentMethods: "طرق الدفع المقبولة: بطاقات الائتمان، التحويل المصرفي",
          orderProcessing: "يتم معالجة الطلبات بعد تأكيد الدفع",
          refundTiming: "المبالغ المستردة تتم معالجتها خلال 5-7 أيام عمل"
        },
        shippingDetails: {
          freeShipping: "شحن مجاني للطلبات فوق 150",
          standardDelivery: "التوصيل القياسي: 3-5 أيام عمل",
          expressDelivery: "التوصيل السريع: 1-2 يوم عمل",
          localPickup: "الاستلام المحلي متاح في الرياض"
        },
        returnsDetails: {
          originalCondition: "يجب أن تكون العناصر في حالتها الأصلية",
          freeReturn: "شحن إرجاع مجاني",
          fullRefund: "استرداد كامل أو تبديل",
          co2NotEligible: "أسطوانات ثاني أكسيد الكربون غير مؤهلة للإرجاع"
        },
        warrantyDetails: {
          sodaMakerWarranty: "ضمان سنتان على صانعات الصودا",
          accessoriesWarranty: "ضمان سنة واحدة على الملحقات",
          manufacturingDefects: "الضمان يغطي عيوب التصنيع",
          normalWear: "الاستخدام العادي والتآكل غير مغطى"
        },
        liabilityDetails: {
          maxLiability: "الحد الأقصى للمسؤولية: سعر شراء المنتج",
          noIndirectDamages: "لا توجد مسؤولية عن الأضرار غير المباشرة",
          noMisuseLiability: "لا توجد مسؤولية عن سوء استخدام المنتجات",
          forceMajeure: "أحداث القوة القاهرة مستثناة"
        },
        terminationDetails: {
          termsViolation: "انتهاك الشروط والأحكام",
          fraudulentActivities: "الأنشطة الاحتيالية أو غير القانونية",
          nonPayment: "عدم دفع الرسوم",
          serviceAbuse: "إساءة استخدام الخدمات"
        },
        address: "الرياض، المملكة العربية السعودية"
      }
    },
    exchangeAndReturnPolicy: {
      hero: {
        title: "سياسة الاستبدال والاسترجاع والشحن",
        subtitle: "الشروط والأحكام",
        lastUpdated: "تاريخ السريان: سبتمبر 2022"
      },
      sections: {
        introduction: {
          title: "المقدمة",
          p1: "يرجى قراءة هذه الشروط بعناية تامة للتأكد من فهمك لكل بند قبل استخدام منصّة \"Drinkmate\"، لأنها تؤثر على حقوقك القانونية.",
          p2: "تحكم شروط الاستخدام إلى جانب سياسة الخصوصية (يشار إليها إجمالاً بـ \"الشروط والأحكام\") وصولك واستخدامك لمنصّة \"Drinkmate\" وخصائصه وخدماته.",
          p3: "من خلال تسجيل حساب أو استخدام منصّة \"Drinkmate\"، فأنت تؤكد لنا بأنك قرأت وفهمت هذه الشروط وتوافق على الالتزام بها، إذا كنت لا توافق على هذه الشروط، فالرجاء عدم استخدام المنصّة."
        },
        definitions: {
          title: "التعريفات",
          intro: "في هذه الشروط، وما لم يقتضِ السياق خلاف ذلك يكون للمصطلحات التالية المعاني المشار إليها:",
          items: [
            "\"المنصّة\"، \"نحن\"، \"ضمير المتكلم\" أو \"ضمير الملكية\": يشير إلى منصّة \"Drinkmate\".",
            "\"المستخدم\"، \"أنت\" أو \"ضمير الملكية للمخاطب\": يشير إلى كل شخص يقوم بإنشاء حساب أو يزور المنصّة أو يستخدم الخدمات.",
            "\"مقدم الخدمة\": يشير إلى كل مورد وموزع يسجل حساب في منصّة \"Drinkmate\" بغرض بيع منتجاتها.",
            "\"المستهلك\": يشير إلى كل من يسجل حساب في منصّة \"Drinkmate\" بغرض شراء المنتجات.",
            "\"المنتجات\": تشير إلى النكهات وأسطوانات ثاني أكسيد الكربون والمنتجات والمشروبات والاكسسوارات ذات الصلة.",
            "\"الطلب\": يشير إلى طلب شراء المنتجات من خلال منصّة \"Drinkmate\".",
            "\"القوانين\": تشير إلى الأنظمة واللوائح السارية في المملكة العربية السعودية.",
            "\"الشروط والأحكام\"، \"الاتفاقية\": تشير إلى هذه الشروط بالإضافة إلى سياسة الخصوصية وكافة السياسات والشروط الأخرى."
          ]
        },
        legalLimits: {
          title: "الحدود القانونية لخدماتنا",
          p1: "\"Drinkmate\" منصّة إلكترونية تعمل كوسيط عبر الإنترنت بين مقدمي خدمات المنتجات وبين المستهلكين الذين يطلبون النكهات وأسطوانات ثاني أكسيد الكربون والمنتجات والمشروبات ذات الصلة بأسعار مناسبة وتوصيلها لكافة مناطق المملكة العربية السعودية.",
          p2: "يعلم ويوافق المستخدم أن دور منصّة \"Drinkmate\" يقتصر على الربط بين مقدم الخدمة والمستهلك، وتوفر المنصّة الآتي:",
          items: [
            "تسجيل حساب مجاني في المنصّة.",
            "البنية التحتية التقنية مثل مركز الاتصال، ولوحة تحكم لمقدمي الخدمات لإدارة الطلبات، وما إلى ذلك.",
            "عرض المنتجات على المنصّة.",
            "وسائل الدفع المختلفة التي تتناسب مع الجميع.",
            "الدعم الفني والاتصال بين الأطراف."
          ],
          p3: "عند تعاقد المستهلك مع مقدم الخدمة من خلال المنصّة، يدخل الطرفان في علاقة مباشرة وملزمة قانونًا، ويقتصر دورنا فقط على الربط بين مقدم الخدمة والمستهلك.",
          p4: "يوافق المستخدم على أن منصّة \"Drinkmate\" تقوم بتحصيل ومعالجة رسوم المعاملات بين الأطراف.",
          p5: "يحق لنا وفقاً لتقديرنا الخاص بتعديل أو تحديث الخدمات الحالية للمنصة، دون أية مسؤولية تجاه أي مستخدم."
        },
        legalCapacity: {
          title: "الأهلية القانونية",
          p1: "نرغب في التأكد من قدرة كل مستخدم على إبرام عقود قانونية ملزمة على الإنترنت؛ لذا يقر المستخدم بأنه يتمتع بالأهلية القانونية اللازمة لإبرام وقبول هذه الشروط، وأن لديه كامل الصلاحيات القانونية غير المقيدة وفقاً لما يلي:",
          items: [
            "الأهلية القانونية للشخص الطبيعي: يشترط في مُستخدِم منصّة \"Drinkmate\" أن يكون بلغ من العمر 18 عامًا فأكثر وأن يتوفر فيه الأهلية القانونية اللازمة لإبرام العقود، فإذا كان عمرك أقل من 18 عامًا، يجب عليك الحصول على موافقة أحد الوالدين أو الوصي القانوني، وقبولهم لهذه الشروط وموافقتهم على تحمل المسؤولية عن أفعالك، وأي رسوم مرتبطة باستخدامك للخدمات.",
            "الصفة القانونية للكيان التجاري: إذا كنت تسجل كمقدم خدمات، فأنت تقر بأن لديك سلطة إلزام هذا الكيان بهذه الشروط، وأنك والكيان التجاري سوف تخضعون لجميع القوانين السارية المتعلقة بالتداول عبر شبكة الإنترنت.",
            "يوافق المستخدم بأنه في حال مخالفته لهذا البند، فإنه يتحمّل تبعات هذه المخالفة أمام الغير."
          ],
          p2: ""
        },
        membershipPolicy: {
          title: "سياسة العضوية",
          p1: "للاستفادة من منصّة \"Drinkmate\"، يجب عليك تسجيل حساب صحيح كما هو مطلوب في نموذج التسجيل والموافقة على الشروط والأحكام، وعندما تصبح عضوًا، فأنت توافق على:",
          items: [
            "تقديم بيانات صحيحة ودقيقة وكاملة كما هو مطلوب في نموذج التسجيل على المنصّة.",
            "الحفاظ على سرية بيانات حسابك، وتقييد الغير من استخدام الحساب.",
            "تحمل المسؤولية عن الأنشطة التي تحدث من خلال حسابك.",
            "إبلاغنا فورًا في حالة اختراق أو سرقة الحساب أو اكتشاف أي استخدام غير قانوني لحسابك بالمنصّة، وذلك حتى نستطيع اتخاذ الإجراءات التقنية اللازمة للمحافظة على الحساب."
          ],
          p2: "نحتفظ بالحق في إلغاء الحسابات التي لم يتم تأكيدها أو غير النشطة لفترة طويلة.",
          items2: [
            "تقدم العضوية في منصّة \"Drinkmate\" بنظام الترخيص لاستخدام المنصّة، وبالتالي يحق لنا سحب هذا الترخيص وإنهاء عضويتك في الحالات التالية:",
            "إذا لم تلتزم بالشروط والسياسات والقواعد والإرشادات التي تتعلق بالمنصّة.",
            "إذا لم نتمكن من التأكد أو التحقق من أي معلومات مقدمة من قبلك.",
            "إذا قررنا وفقًا لتقديرنا الخاص أن أي من تصرفاتك قد تسبب أضراراً لنا.",
            "إذا رأينا في أي وقت وفقاً لما يراه مناسبًا لتعليق أي حساب مخالف."
          ]
        },
        purchasePolicy: {
          title: "سياسة الشراء",
          items: [
            "يمكن للأشخاص الذين يمكنهم إبرام عقود عبر الإنترنت بشكل قانوني وفقًا لقوانين المملكة العربية السعودية شراء المنتجات من خلال منصّة \"Drinkmate\".",
            "جميع بيانات المنتجات بما فيها الأسعار والتوفر والصور يتم توفيرها وتحديثها مباشرة من مقدمي الخدمات (الموردين والموزعين).",
            "يجب أن تكون المنتجات المعروضة متوافقة مع معايير الصحة والسلامة ومصرح بتداولها وبيعها بالمملكة العربية السعودية، وأن تضمن خلوها من أي مسببات للأضرار.",
            "يجب أن تكون المنتجات صحية وصالحة للاستخدام، وأن يوضح مقدم الخدمة كافة خصائصها وصلاحية استخدامها.",
            "قد تكون بعض المنتجات ذات كميات محدودة.",
            "قد تحدث بعض الأخطاء خلال عملية توفير المنتجات أو توفير المعلومات التفصيلية عن الأسعار على المنصة من قبل مقدمي الخدمات، لذا نحن لا نتحمل المسؤولية عن أي أخطاء تجدها أثناء إتمام الطلب، وستقوم المنصّة بإرسال إشعار لمقدم الخدمة بتصحيح الأخطاء.",
            "يوافق المستهلك على دفع قيمة المنتجات كما هو موضح أثناء عملية الطلب، إلى جانب أي تكاليف شحن أو رسوم أخرى تطبق على هذا الطلب.",
            "في بعض الحالات، قد لا يقبل طلب المستهلك للأسباب التالية:",
            "يتحمل المستهلك مسؤولية متابعة حالة طلبك."
          ],
          subItems: [
            "عدم توافر المنتج.",
            "تقديم بطاقة ائتمان مسروقة أو الاحتيال في الدفع.",
            "إذا كان هناك خطأ في الصور أو السعر أو وصف المنتج على المنصة.",
            "إذا كان هناك خطأ عند إدراج أحد المنتجات في عملية البيع أو الترويج."
          ]
        },
        pricesAndTaxes: {
          title: "سياسة الأسعار والضرائب",
          items: [
            "جميع أسعار المنتجات المعروضة على منصّة \"Drinkmate\" بالعملة المحلية (الريال السعودي).",
            "تخضع الأسعار للتعديل والتحديث من قبل مقدم الخدمة.",
            "تشمل الأسعار ضريبة القيمة المضافة بنسبة 15% على طلبات الشراء، أيّ تغيير في نسبة ضريبة القيمة المضافة المعمول بها سينعكس تلقائياً على سعر المنتج."
          ]
        },
        paymentPolicy: {
          title: "سياسة الدفع",
          items: [
            "توفر منصّة \"Drinkmate\" الدفع من خلال بوابات الدفع الإلكتروني بالبطاقات الائتمانية ومدى والتحويل البنكي.",
            "يجب عليك التأكد من أنّ البيانات التي تدخلها أثناء عملية الدفع صحيحة ودقيقة وسارية المفعول.",
            "يجب على المستخدم استخدام بطاقاته البنكية والتأكد من صحة ودقة المعلومات التي يدخلها قبل إتمام الدفع، وفي حال استخدم إحدى البطاقات لطرف آخر يجب أن يكون لديه تفويض أو إذن باستخدامها، وبالتالي تخلي مسؤولية منصّة \"Drinkmate\" نتيجة ذلك.",
            "لا نخزن أرقام بطاقة الائتمان على أنظمتنا، كما يتم حماية تفاصيل الدفع قبل نقلها باستخدام أحدث تقنيات الحماية الالكتروني التي تتبع أعلى معايير الأمان.",
            "يحق لنا تعديل هذه السياسة من خلال إضافة وسائل دفع جديدة مستقبلاً أو إلغاء أي وسيلة حالية، وسيتم إفادتك في حال طبقنا ذلك."
          ]
        },
        shippingPolicy: {
          title: "سياسة الشحن",
          items: [
            "يتم شحن الطلبات إلى العنوان المحدد من المستهلك في غضون 3 أيام عمل بعد تأكيد البائع.",
            "يتحمل المستهلك رسوم توصيل الطلب بالإضافة إلى ثمن المنتجات.",
            "قد تتأخر عملية الشحن لأسباب تتعلق بالقوة القاهرة أو الظروف الخارجة عن الإرادة، وفي هذه الحالة لن نتحمل أيّ مسؤوليات نتيجة تأخر توصيل الطلب، وسيتم إعلامك بحالة التأخير عبر البريد الإلكتروني أو الهاتف من قبل البائع.",
            "يرجى الاطلاع على قائمة المدن التي يتم الشحن اليها من خلال شركات الشحن المعتمدة."
          ]
        },
        cancellationAndReturns: {
          title: "سياسة الإلغاء والإرجاع",
          items: [
            "تحتفظ منصّة \"Drinkmate\" بالحق الحصري في رفض أو إلغاء أي طلب للنكهات وأسطوانات ثاني أكسيد الكربون والمنتجات والمشروبات ذات الصلة المدرجة بسعر غير صحيح أو غير متوفر، بغض النظر عن تأكيد الطلب أو تأكيد الدفع. وفي مثل هذه الحالات، إذا تمت معالجة الدفع، فسيتم رد المبلغ إلى المستهلك بنفس طريقة الدفع الأصلية.",
            "يمكن للمستهلك إلغاء الطلب ما لم يتم قبوله أو معالجته من قبل مقدم الخدمة.",
            "لا تقدم أو تبيع منصّة \"Drinkmate\" أي منتجات للمستهلك، وإنما يتم توفير المنتجات من قبل مقدمي الخدمات، وهم مستقلون تمامًا في أداء عملهم، وبالتالي ستطبق سياسة الإرجاع والاستبدال لمقدمي الخدمات، ويقر ويوافق المستهلك بأنها قد تختلف من مقدم خدمة لآخر."
          ]
        },
        useLicenses: {
          title: "تراخيص الاستخدام",
          p1: "بالنظر إلى موافقتك على الالتزام بهذه الشروط، فإننا نمنحك بموجب هذا حقًا وترخيصًا غير حصري وغير قابل للتحويل وقابل للإلغاء من أجل:",
          items: [
            "الوصول إلى خدماتنا واستخدامها وفقاً لهذه الشروط.",
            "الوصول إلى واستخدام أي محتوى أو معلومات أو مواد ذات صلة قد تكون متاحة من خلال خدماتنا فقط للاستخدام الشخصي غير التجاري، ووفقاً لما هو منصوص عليه في هذه الشروط."
          ],
          itemsNot: [
            "لا يحق لك تعديل أي محتوى طبعته أو نزّلته بأي شكل من الأشكال.",
            "لا يحق لك انتهاك قوانين حقوق النشر، أو العلامة التجارية، أو براءة الاختراع، أو الإعلان، أو قواعد قواعد البيانات، أو أي من حقوق الملكية الفكرية التي تتعلق بنا أو المرخصّة لنا أو التي تتعلق بالغير.",
            "لا يحق لك الوصول أو محاولة الوصول إلى أي من جوانب خدماتنا أو أي محتوى غير مصرّح لك بالوصول إليه بموجب هذه الشروط أو كما حددناه بوضوح."
          ],
          p2: "لا يشمل الترخيص الممنوح للمستخدم أيّ حقوق ملكية في المنصّة أو جزء منه، كما لا يشير هذا الترخيص بشكل مباشر أو غير مباشر بوجود شراكة من أيّ نوع بيننا وبين أي مستخدم."
        },
        securityProtection: {
          title: "الحماية الأمنية للمنصّة",
          p1: "يجوز لك استخدام خدماتنا والمحتوى الذي نقدمه وفقاً لهذه الشروط فقط: أنت توافق على الآتي:",
          items: [
            "لا يجوز لك بتاتاً أن تنتهك أو تحاول انتهاك الحماية الأمنية للمنصّة.",
            "لا يجوز لك ترخيص، أو بيع، أو تأجير، أو نقل، أو تخصيص، أو توزيع، أو استضافة، أو استغلال الخدمة.",
            "لا يجوز محاولة استكشاف أو اختبار مدى قدرة المنصة أو الشبكة أو محاولة اختراق النظام الأمني أو مستويات الحماية دون أن تكون مخولاً بذلك.",
            "لا يجوز لك تعديل، أو ترجمة، أو تكييف، أو دمج، أو إجراء أعمال مشتقة لأي جزء من المنصّة.",
            "لا يجوز لك الوصول إلى المنصّة من أجل إنشاء خدمات أو مواقع مماثلة أو منافسة.",
            "لا يجوز نسخ أي جزء من المنصّة، أو إعادة إنتاجه، أو توزيعه، أو إعادة نشره، أو تنزيله، أو عرضه، أو إرساله، أو نقله بأي شكل من الأشكال أو بأي وسيلة.",
            "لا يجوز لك إزالة أو إتلاف أي شعارات أو علامات ملكية في المنصّة."
          ]
        },
        intellectualProperty: {
          title: "حقوق الملكيّة الفكرية",
          p1: "كافة الحقوق القانونية وحقوق الملكية الفكرية والعلامات التجارية في منصّة \"Drinkmate\" وكافة حقوق النشر والمظهر التجاري والتصاميم والشعارات والأيقونات، وغير ذلك من الملكيات الفكرية والمواد والحقوق الأخرى بما فيها الحقوق البرمجية ورمز الـ(HTML) وغيرها من الرموز التي يحتوي عليها بما في ذلك المحتوى والنصوص والخطوط والصور والبرامج وملفات الصوت والموسيقى والفيديو والمواد الرقمية، والوثائق والبيانات والأشكال، هي ملك لنا أو المرخصين لنا.",
          p2: "نملك جميع العلامات التجارية وعلامات الخدمة والأسماء التجارية و/أو مسجلة و/أو مرخصة من قبلنا. ولا يُسمح لك باستخدام أي من العلامات التجارية أو علامات الخدمات أو الأسماء التجارية الخاصة بنا في أي وسيلة إعلامية أو إعلانية دون إذن كتابي منا.",
          p3: "لا يحق لك نسخ أو إعادة إنتاج أي من خدماتنا أو توزيعها أو استغلالها تجارياً، ويشمل ذلك المحتوى الخاص بنا، إلا بعد إذن خطي صريح منا."
        },
        disclaimer: {
          title: "إخلاء المسؤولية",
          p1: "تقدم خدمات ومحتويات منصّة \"Drinkmate\" وفقاً لقاعدة \"كما هي\" و \"كما هو متاح\" دون أي ضمانات أو كفالات من أي نوع سواء صريحة أو ضمنية.",
          p2: "لا نلتزم بأي تعهدات أخرى متعلقة بخدماتنا، أو بمنتجات، أو خدمات، أو معلومات أخرى حصلت عليها من خلال المنصّة، ويشمل ذلك موثوقيتها أو دقتها أو جودتها أو توفرها أو توقيتها أو أمانها أو قدرتها على تلبية احتياجاتك.",
          p3: "نحن لسنا مسؤولين عن دقة أو موثوقية أي معلومات أو محتوى يرسل أو ينشر عبر خدماتنا.",
          p4: "يوافق المستخدم على أن جميع المعلومات التي يقدمها لنا (بما في ذلك التسجيل) صحيحة ودقيقة ومحدثة من جميع النواحي وأنها لا تنتهك أي حقوق ملكية أو تشجع على الإرهاب والكراهية أو تحتوي على مواد أو معلومات مسيئة للغير أو صور إباحية، وعلى مسؤوليته الشخصية.",
          p5: "يوافق المستخدم على تحمل المسؤولية الكاملة عن استخدامه لمنصّة \"Drinkmate\". لن نتحمل المسؤولية عن الخسائر، أو الأضرار سواء المباشرة، أو غير المباشرة، أو التبعية، أو العرضية التي تنشأ عن بما في ذلك على سبيل المثال لا الحصر:",
          items: [
            "المعلومات التي تتعلق بالمنتجات.",
            "أيّ فشل، أو خطأ، أو سهو، أو أعطال، أو توقف في تشغيل المنصّة.",
            "الانقطاع في الخدمة بسبب أعمال الصيانة الدورية أو إصلاح المشكلات الفنية أو ما شابه.",
            "فشل المستخدم في الحفاظ على أمان وسرية وخصوصية بيانات حسابه.",
            "الظروف خارجة عن الإرادة أو القوة القاهرة أو الظروف الطارئة."
          ],
          p6: "لا نضمن أن تكون الإعلانات أو المحتوى الخاص بها أو الصور ستكون دقيقة أو كاملة أو موثوقاً بها أو خالية من الأخطاء.",
          p7: "نبذل قصارى جهدنا لضمان توافر المنصّة للاستخدام على مدار الساعة، ولكن لا نضمن أن المنصّة ستكون متاحة بشكل تام وآمن في الوقت المحدد، فقد تكون المنصّة غير متاحة من وقت لآخر أثناء الإصلاح أو الصيانة أو تطوير العمل."
        },
        compensation: {
          title: "التعويض",
          p1: "أنت توافق على تبرئة ذمتنا وإعفائنا وتعويضنا ضد أي وجميع المطالبات، والنفقات والتكاليف والإجراءات والطلبات والمسؤوليات والأحكام والتسويات (ويشمل ذلك الرسوم القانونية المناسبة) الناتجة أو المزعوم أنها ناتجة عن استخدامك للخدمات والمحتوى و /أو أي خرق لهذه الشروط، و/أو إساءة الاستخدام أو الاستخدام غير القانوني للمنصّة مهما كان نوعه.",
          p2: "أنت ملزم بتعويضنا عن أي خسائر أو أضرار قد تلحق بالمنصّة نتيجة أي استخدام غير شرعي أو غير مفوض من قِبلك."
        },
        linksToSites: {
          title: "روابط المواقع المرتبطة",
          p1: "يرجى العلم إنك إن وصلت، أو أعيد تحويلك، إلى مواقع خارجية خاصة بأطراف أخرى عند استخدامك لخدماتنا، فربما يكون لتلك المواقع الخارجية الأخرى شروط استخدام وخصوصية مختلفة يجب الالتزام بها والموافقة عليها قبل منحك حق الوصول إليها.",
          p2: "نحن لسنا مسؤولين ولا نقدم أي تعهدات (أو ندعم بأي شكل من الأشكال) أي مواد أو خدمات متاحة في أو من هذه المواقع الخارجية (ويشمل ذلك الوصول إلى تسجيل الدخول أو التسجيل).",
          p3: "لا نضمن بأي شكل من الأشكال أن تكون هذه المواقع الخارجية التي يملكها طرف ثالث محدّثة وخالية من أي أخطاء أو غموض أو سهو أو أن تكون مناسبة لأي غرض من الأغراض."
        },
        termAndTermination: {
          title: "المدة والإنهاء",
          p1: "تسري هذه الشروط فور تسجيل حساب، والإقرار بقبولك وستظل سارية المفعول حتى يتم إنهاؤها من قبلك أو من قبلنا.",
          p2: "يجوز لنا إنهاء هذه الشروط في أي وقت دون إشعار، في حال انتهكت أيًا من هذه الشروط.",
          p3: "عند الإنهاء، سيتم إنهاء جميع الحقوق الممنوحة لك بموجب هذه الشروط."
        },
        transferOfRights: {
          title: "نقل الحقوق والالتزامات",
          p1: "يحق لنا نقل كل أو جزء من حقوقنا أو التزاماتنا أو مسؤولياتنا (سواء الصريحة أو المفترضة) بموجب هذه الشروط إلى أي كيان آخر، واستخدام كل المساعي المتاحة لإعلامك بأي تحويل عن طريق النشر على المنصّة.",
          p2: "لا يجوز للمستخدم نقل كل أو جزء من حقوقه أو التزاماته بموجب هذه الشروط إلى أي طرف ثالث دون موافقة كتابية مسبقة من منصّة \"Drinkmate\"."
        },
        applicableLaw: {
          title: "النظام الواجب التطبيق",
          p1: "تخضع هذه الشروط وتُفسر وفقًا للأنظمة المعمول بها في المملكة العربية السعودية.",
          p2: "إذا اعتبر أي من هذه الشروط غير قانوني أو باطل أو غير قابل للتنفيذ بموجب القوانين المعمول بها، فسيعتبر هذا الشرط مفصولاً عن هذه الشروط، ولا يؤثر على صحة ونفاذ باقي الأحكام."
        },
        modifications: {
          title: "التعديلات",
          p1: "يحق لنا مراجعة وتعديل هذه الشروط وفقاً لتقديرنا المطلق في أي وقت نراه مناسباً ولأي سبب، وستكون هذه التعديلات سارية المفعول فور نشرها على هذه الصفحة، وسنقوم بتحديث تاريخ السريان.",
          p2: "يجب على المستخدم الاطلاع على هذه التعديلات قبل الاستمرار في استخدام منصّة \"Drinkmate\".",
          p3: "يعد استمرارك في استخدام منصّة \"Drinkmate\" بعد إجراء أي تحديثات على هذه الشروط وسياسة الخصوصية سواء بالإضافة أو الحذف أو التعديل موافقة صريحة منك على هذه التحديثات.",
          p4: "يحق لنا إجراء أية تعديلات أو تحسينات نراها ضرورية على منصّة \"Drinkmate\" لزيادة فاعليته، ويلتزم المستخدم بأية تعليمات تقدمها المنصّة إليه في هذا الخصوص."
        },
        theLanguage: {
          title: "اللغة",
          p1: "كتبت هذه الشروط باللغتين العربية والإنجليزية، وستعتمد اللغة العربية لغرض تفسير وتنفيذ هذه الشروط إذا تعارضت اللغة الإنجليزية معها."
        },
        fullAgreement: {
          title: "الاتفاق الكامل",
          p1: "تحدد هذه الشروط (أو بصيغتها المُعدلة من حين لآخر) كل بنود الاتفاق بينك وبين منصّة \"Drinkmate\"، وتحل محل أيّ إصدارات سابقة من هذه الشروط. وفي حال تعارضت هذه الشروط مع أيّ من إصدارات سابقة لها، فإنّ النسخة الحالية تكون هي السائدة.",
          p2: ""
        },
        rightsReserved: "جميع الحقوق محفوظة لـ Drinkmate 2025."
      }
    },
    cookiePolicy: {
      hero: {
        title: "سياسة ملفات تعريف الارتباط",
        subtitle: "كيف نستخدم ملفات تعريف الارتباط",
        lastUpdated: "آخر تحديث: يناير 2024"
      },
      sections: {
        whatAreCookies: {
          title: "ما هي ملفات تعريف الارتباط؟",
          description: "ملفات تعريف الارتباط هي ملفات نصية صغيرة تُخزن على جهازك عند زيارة موقعنا الإلكتروني."
        },
        howWeUseCookies: {
          title: "كيف نستخدم ملفات تعريف الارتباط",
          description: "نحن نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتقديم محتوى مخصص.",
          purposes: [
            "تذكر تفضيلاتك وإعداداتك",
            "تحليل حركة المرور على الموقع والاستخدام",
            "تقديم محتوى وإعلانات مخصصة",
            "تحسين وظائف الموقع",
            "ضمان الأمان ومنع الاحتيال"
          ]
        },
        typesOfCookies: {
          title: "أنواع ملفات تعريف الارتباط التي نستخدمها",
          essential: "ملفات تعريف الارتباط الأساسية ضرورية لكي يعمل الموقع بشكل صحيح.",
          analytics: "ملفات تعريف الارتباط التحليلية تساعدنا في فهم كيفية استخدام الزوار لموقعنا.",
          marketing: "ملفات تعريف الارتباط التسويقية تُستخدم لتقديم إعلانات ذات صلة.",
          preferences: "ملفات تعريف الارتباط التفضيلية تتذكر خياراتك وإعداداتك."
        },
        managingCookies: {
          title: "إدارة ملفات تعريف الارتباط",
          description: "يمكنك التحكم في ملفات تعريف الارتباط وإدارتها من خلال إعدادات المتصفح.",
          browser: "إعدادات المتصفح",
          settings: "معظم المتصفحات تسمح لك بحظر أو حذف ملفات تعريف الارتباط."
        },
        thirdPartyCookies: {
          title: "ملفات تعريف الارتباط من أطراف ثالثة",
          description: "بعض ملفات تعريف الارتباط تُوضع بواسطة خدمات الطرف الثالث التي نستخدمها.",
          services: [
            "جوجل أناليتكس لتحليل الموقع",
            "فيسبوك بيكسل للإعلانات",
            "معالجات الدفع للمعاملات الآمنة",
            "منصات وسائل التواصل الاجتماعي للمشاركة"
          ]
        },
        updates: {
          title: "تحديثات السياسة",
          description: "قد نحدث سياسة ملفات تعريف الارتباط هذه من وقت لآخر. يرجى التحقق بانتظام."
        },
        contact: {
          title: "اتصل بنا",
          description: "إذا كان لديك أسئلة حول استخدامنا لملفات تعريف الارتباط، يرجى الاتصال بنا.",
          email: "privacy@aqualine.sa.com"
        },
        purposesDetails: {
          rememberPreferences: "تذكر تفضيلاتك وإعداداتك",
          analyzeTraffic: "تحليل حركة المرور على الموقع والاستخدام",
          personalizedContent: "تقديم محتوى وإعلانات مخصصة",
          improveFunctionality: "تحسين وظائف الموقع",
          ensureSecurity: "ضمان الأمان ومنع الاحتيال"
        },
        thirdPartyServices: {
          googleAnalytics: "جوجل أناليتكس لتحليل الموقع",
          facebookPixel: "فيسبوك بيكسل للإعلانات",
          paymentProcessors: "معالجات الدفع للمعاملات الآمنة",
          socialMedia: "منصات وسائل التواصل الاجتماعي للمشاركة"
        },
        address: "الرياض، المملكة العربية السعودية"
      }
    },
    co2: {
      hero: {
        title: "حلول ثاني أكسيد الكربون",
        subtitle: "حافظ على مشروباتك متلألئة",
        description: "أسطوانات ثاني أكسيد الكربون عالية الجودة وخدمات التبادل المريحة. حافظ على تجربة درينك ميت مع حلول ثاني أكسيد الكربون الموثوقة.",
        orderCO2: "اطلب ثاني أكسيد الكربون",
        learnMore: "اعرف المزيد",
        drinksLabel: "مشروب",
        liters: "60 لتر"
      },
      productOptions: {
        title: "خيارات أسطوانات ثاني أكسيد الكربون",
        subtitle: "اختر الحل المثالي لاحتياجاتك",
        singleCylinder: {
          title: "أسطوانة واحدة",
          description: "مثالية للاستخدام الفردي",
          capacity: "60 لتر",
          price: "99",
          lifespan: "2-3 أشهر",
          orderNow: "اطلب الآن"
        },
        exchangeProgram: {
          title: "برنامج التبادل",
          description: "أرجع الفارغة واحصل على ممتلئة",
          exchangeFee: "55",
          convenience: "بدون متاعب",
          ecoFriendly: "صديق للبيئة",
          exchangeNow: "تبادل الآن"
        },
        bulkOrders: {
          title: "الطلبات بالجملة",
          description: "للشركات والفعاليات",
          minQuantity: "10 أسطوانات",
          discount: "خصم 15%",
          delivery: "توصيل مجاني",
          getQuote: "احصل على عرض سعر"
        }
      },
      refillServices: {
        title: "خدمات إعادة ملء ثاني أكسيد الكربون",
        subtitle: "إعادة ملء احترافية بمعايير السلامة",
        safetyFirst: {
          title: "السلامة أولاً",
          description: "جميع أسطوانات ثاني أكسيد الكربون لدينا معتمدة للاستخدام الغذائي وتخضع لفحوصات سلامة صارمة.",
          foodGradeCertification: "شهادة ثاني أكسيد الكربون للاستخدام الغذائي",
          regularSafetyInspections: "فحوصات سلامة منتظمة",
          properHandlingProcedures: "إجراءات التعامل الصحيحة",
          emergencyProtocols: "بروتوكولات الطوارئ"
        },
        convenientDelivery: {
          title: "توصيل مريح",
          description: "نقدم خدمات توصيل سريعة وموثوقة إلى باب منزلك.",
          sameDayDelivery: "توصيل في نفس اليوم متاح",
          flexibleScheduling: "جدولة مرنة",
          professionalHandling: "تعامل احترافي",
          realTimeTracking: "تتبع في الوقت الفعلي"
        }
      },
      exchangeProgram: {
        title: "برنامج تبادل ثاني أكسيد الكربون",
        subtitle: "حل مستدام وفعال من حيث التكلفة",
        howItWorks: "كيف يعمل",
        step1: {
          title: "أرجع الأسطوانة الفارغة",
          description: "أرسل أسطوانتك الفارغة"
        },
        step2: {
          title: "احصل على أسطوانة ممتلئة",
          description: "استلم أسطوانة ثاني أكسيد كربون جديدة وممتلئة"
        },
        step3: {
          title: "ادفع الفرق فقط",
          description: "وفر حتى 40% مقارنة بالجديدة"
        },
        saveMoney: "وفر المال",
        ecoFriendly: "صديق للبيئة"
      },
      safetyHandling: {
        title: "سلامة وتداول ثاني أكسيد الكربون",
        subtitle: "إرشادات مهمة للاستخدام الآمن",
        safetyGuidelines: {
          title: "إرشادات السلامة",
          guideline1: "خزن في مكان بارد وجاف",
          guideline2: "استخدم حاوية مناسبة للنقل",
          guideline3: "اتبع إرشادات السلامة للتخلص",
          guideline4: "لا تعرض للحرارة العالية"
        },
        properUsage: {
          title: "الاستخدام الصحيح",
          usage1: "اقرأ التعليمات بعناية",
          usage2: "استخدم المعدات المناسبة",
          usage3: "تحقق من سلامة الأسطوانة",
          usage4: "احتفظ بسجل الاستخدام"
        }
      },
      environmentalImpact: {
        title: "التأثير البيئي",
        subtitle: "التزامنا بالاستدامة",
        reducedWaste: {
          title: "تقليل النفايات",
          description: "الأسطوانات القابلة لإعادة الاستخدام تقلل من الحاويات ذات الاستخدام الواحد"
        },
        circularEconomy: {
          title: "الاقتصاد الدائري",
          description: "نظام تبادل مستدام"
        },
        safeDisposal: {
          title: "التخلص الآمن",
          description: "إرشادات للتخلص الصحيح"
        }
      },
      businessSolutions: {
        title: "حلول للشركات",
        subtitle: "خدمات مخصصة للشركات",
        restaurantsCafes: {
          title: "المطاعم والمقاهي",
          description: "حلول ثاني أكسيد الكربون المخصصة لصناعة الغذاء",
          feature1: "أسعار بالجملة",
          feature2: "توصيل مجدول",
          feature3: "دعم مخصص",
          feature4: "خدمة 24/7",
          getBusinessQuote: "احصل على عرض سعر للشركات"
        },
        eventsCatering: {
          title: "الفعاليات والضيافة",
          description: "خدمات للفعاليات الخاصة",
          feature1: "تخطيط الفعاليات",
          feature2: "خدمة الضيافة",
          feature3: "معدات احترافية",
          feature4: "دعم الفعاليات",
          eventPlanning: "تخطيط الفعاليات"
        }
      }
    },
    contact: {
      title: "تواصل معنا",
      subtitle: "نحن هنا للمساعدة",
      description: "هل لديك أسئلة حول منتجاتنا أو تحتاج إلى دعم؟ تواصل معنا من خلال أي قناة أدناه.",
      phoneSupport: {
        title: "الدعم الهاتفي",
        description: "تحدث مباشرة مع فريق الدعم لدينا",
        hours: "الاثنين-الجمعة: 9 صباحاً-6 مساءً (توقيت السعودية)"
      },
      emailSupport: {
        title: "الدعم عبر البريد الإلكتروني",
        description: "أرسل لنا رسالة مفصلة",
        response: "رد خلال 24 ساعة"
      },
      officeLocation: {
        title: "موقع المكتب",
        description: "زر مكتبنا الرئيسي",
        appointment: "بموعد مسبق فقط"
      },
      form: {
        title: "أرسل لنا رسالة",
        subtitle: "املأ النموذج وسنرد في أقرب وقت",
        fullName: "الاسم الكامل *",
        email: "عنوان البريد الإلكتروني *",
        phone: "رقم الهاتف",
        subject: "الموضوع *",
        message: "الرسالة *",
        sendMessage: "أرسل الرسالة",
        sending: "جار الإرسال...",
        optional: "اختياري",
        subjects: {
          general: "استفسار عام",
          product: "سؤال عن المنتج",
          support: "الدعم التقني",
          order: "حالة الطلب",
          refund: "طلب استرداد",
          other: "أخرى"
        },
        placeholders: {
          fullName: "أدخل اسمك الكامل",
          email: "أدخل بريدك الإلكتروني",
          phone: "أدخل رقم هاتفك",
          subject: "اختر موضوعاً",
          message: "كيف يمكننا مساعدتك؟"
        }
      },
      faq: {
        title: "الأسئلة الشائعة",
        subtitle: "أسئلة شائعة حول منتجاتنا",
        questions: {
          q1: "كيف تعمل درينك ميت؟",
          a1: "تستخدم ثاني أكسيد الكربون لإضافة الغاز لأي سائل في ثوانٍ بضغطة بسيطة.",
          q2: "كم تدوم أسطوانة ثاني أكسيد الكربون؟",
          a2: "أسطوانة 60 لتر تضيف الغاز لحوالي 60 لتر من السائل.",
          q3: "هل يمكنني إضافة الغاز لأي مشروب؟",
          a3: "نعم! بما في ذلك العصير والنبيذ والكوكتيلات والمزيد.",
          q4: "كيف أعيد ملء ثاني أكسيد الكربون؟",
          a4: "استخدم برنامج التبادل أو زر مواقع الشركاء.",
          q5: "هل الشراب طبيعي؟",
          a5: "نعم، جميع الشرابات تستخدم مكونات طبيعية بدون مواد حافظة اصطناعية.",
          q6: "ما هي مدة الضمان؟",
          a6: "ضمان سنتين على الآلات مع خيارات ممتدة."
        }
      },
      liveChat: {
        title: "هل تحتاج مساعدة فورية؟",
        description: "تحدث مع فريق الدعم لدينا في الوقت الفعلي",
        startChat: "ابدأ الدردشة المباشرة"
      },
      offices: {
        title: "مكاتبنا",
        subtitle: "زرنا شخصياً",
        riyadh: {
          title: "المكتب الرئيسي - الرياض",
          address: "طريق الملك فهد، العليا، الرياض",
          hours: "الاثنين-الجمعة: 9:00 صباحاً - 6:00 مساءً",
          phone: "+966544671166"
        },
        jeddah: {
          title: "مركز الخدمة - جدة",
          address: "طريق الأمير سلطان، الحمراء، جدة",
          hours: "الاثنين-الجمعة: 8:00 صباحاً - 5:00 مساءً",
          phone: "+966544671166"
        }
      },
      testimonials: {
        title: "تعليقات العملاء",
        subtitle: "ماذا يقول عملاؤنا",
        testimonial1: {
          text: "خدمة ممتازة! ساعدني الفريق في اختيار صانعة الصودا المثالية.",
          author: "أحمد س.",
          role: "عميل موثق"
        },
        testimonial2: {
          text: "وقت استجابة سريع وموظفين مفيدين جداً. حلوا مشكلة إعادة ملء ثاني أكسيد الكربون بسرعة.",
          author: "سارة م.",
          role: "عميلة موثقة"
        },
        testimonial3: {
          text: "خدمة احترافية مع معرفة كبيرة بالمنتجات.",
          author: "محمد ك.",
          role: "عميل موثق"
        }
      },
      loginToChat: "تسجيل الدخول للدردشة",
      startLiveChat: "بدء الدردشة المباشرة"
    },
    profile: {
      hero: {
        title: "ملفي الشخصي",
        description: "إدارة إعدادات حسابك وعرض تاريخ طلباتك"
      },
      tabs: {
        profile: "الملف الشخصي",
        orders: "الطلبات",
        security: "الأمان"
      },
      personalInfo: {
        title: "المعلومات الشخصية",
        description: "تحديث تفاصيلك الشخصية ومعلومات الاتصال",
        firstName: "الاسم الأول",
        lastName: "اسم العائلة",
        username: "اسم المستخدم",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        firstNamePlaceholder: "أدخل اسمك الأول",
        lastNamePlaceholder: "أدخل اسم العائلة",
        usernamePlaceholder: "أدخل اسم المستخدم",
        emailPlaceholder: "أدخل بريدك الإلكتروني",
        phonePlaceholder: "أدخل رقم هاتفك",
        memberSince: "عضو منذ:",
        lastLogin: "آخر تسجيل دخول:",
        edit: "تعديل",
        cancel: "إلغاء",
        save: "حفظ التغييرات",
        saving: "جاري الحفظ..."
      },
      orders: {
        title: "تاريخ الطلبات",
        description: "عرض وتتبع طلباتك السابقة والحالية",
        noOrders: "لا توجد طلبات بعد",
        noOrdersDescription: "لم تقم بطلب أي منتجات بعد.",
        startShopping: "ابدأ التسوق",
        orderNumber: "رقم الطلب #",
        status: "الحالة",
        total: "المجموع",
        date: "التاريخ",
        items: "العناصر",
        shippingAddress: "عنوان الشحن",
        loading: "جاري تحميل الطلبات..."
      },
      security: {
        changePassword: {
          title: "تغيير كلمة المرور",
          description: "تحديث كلمة المرور للحفاظ على أمان حسابك",
          currentPassword: "كلمة المرور الحالية",
          newPassword: "كلمة المرور الجديدة",
          confirmPassword: "تأكيد كلمة المرور الجديدة",
          currentPasswordPlaceholder: "أدخل كلمة المرور الحالية",
          newPasswordPlaceholder: "أدخل كلمة المرور الجديدة",
          confirmPasswordPlaceholder: "أكد كلمة المرور الجديدة",
          update: "تحديث كلمة المرور",
          updating: "جاري التحديث..."
        },
        accountActions: {
          title: "إجراءات الحساب",
          description: "إدارة إعدادات حسابك وتفضيلاتك",
          signOut: "تسجيل الخروج"
        }
      },
      messages: {
        profileUpdated: "تم تحديث الملف الشخصي بنجاح",
        passwordChanged: "تم تغيير كلمة المرور بنجاح",
        passwordsNotMatch: "كلمات المرور الجديدة غير متطابقة",
        passwordTooShort: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        currentPasswordIncorrect: "كلمة المرور الحالية غير صحيحة",
        loadingProfile: "جاري تحميل الملف الشخصي...",
        failedToLoadOrders: "فشل في تحميل تاريخ الطلبات",
        failedToUpdateProfile: "فشل في تحديث الملف الشخصي",
        failedToChangePassword: "فشل في تغيير كلمة المرور"
      }
    },
    recipes: {
      hero: {
        title: "أنشئ وصفات",
        subtitle: "مشروبات مذهلة",
        description: "اكتشف وصفات مشروبات لذيذة ومنعشة باستخدام شراباتنا الإيطالية عالية الجودة. من المفضلات الكلاسيكية إلى التركيبات الإبداعية، هناك شيء للجميع!",
        exploreRecipes: "استكشف الوصفات",
        downloadPDF: "تحميل PDF",
        recipesCountNumber: "+45",
        recipesLabel: "وصفة"
      },
      featuredRecipe: {
        recipeOfTheWeek: "وصفة الأسبوع",
        description: "وصفة هذا الأسبوع المميزة تعرض التوازن المثالي للنكهات وهي مثالية لأي مناسبة.",
        prepTime: "وقت التحضير",
        difficulty: "الصعوبة",
        ingredients: "المكونات",
        instructions: "التعليمات",
        saveRecipe: "حفظ الوصفة",
        share: "مشاركة"
      },
      categories: {
        all: "الكل",
        fruity: "الفواكه",
        citrus: "الحمضيات",
        berry: "التوت",
        cola: "الكولا"
      },
      recipeData: {
        italianStrawberryLemonade: {
          name: "ليمونادة الفراولة الإيطالية",
          category: "الفواكه",
          difficulty: "سهل",
          time: "5 دقائق",
          instructions: "اخلط شراب الفراولة والليمون مع الماء الفوار، أضف شرائح الليمون الطازج والثلج. زين بأوراق النعناع للحصول على نضارة إضافية."
        },
        cherryColaFizz: {
          name: "فوار كرز الكولا",
          category: "الكولا",
          difficulty: "سهل",
          time: "3 دقائق",
          instructions: "امزج شراب كرز الكولا مع الماء الفوار والثلج. قدمه فوراً للحصول على أقصى فوران."
        },
        blueRaspberryBlast: {
          name: "انفجار التوت الأزرق",
          category: "التوت",
          difficulty: "متوسط",
          time: "7 دقائق",
          instructions: "اخلط شراب التوت الأزرق مع الماء الفوار، أضف التوت الأزرق الطازج والنعناع. زين بغصن نعناع."
        },
        limeMojitoSparkle: {
          name: "موهيتو الليمون الفوار",
          category: "الحمضيات",
          difficulty: "متوسط",
          time: "8 دقائق",
          instructions: "امزج شراب الليمون مع الماء الفوار، أضف الليمون الطازج وأوراق النعناع والسكر والثلج. حرك برفق لخلط النكهات."
        },
        orangeCreamsicle: {
          name: "كريم البرتقال",
          category: "الفواكه",
          difficulty: "سهل",
          time: "4 دقائق",
          instructions: "اخلط شراب البرتقال والفانيليا مع الماء الفوار، أضف الكريمة والثلج. حرك برفق لإنشاء ملمس كريمي."
        },
        grapeSodaSupreme: {
          name: "مشروب العنب الممتاز",
          category: "الفواكه",
          difficulty: "سهل",
          time: "3 دقائق",
          instructions: "امزج شراب العنب مع الماء الفوار والثلج. قدمه فوراً للحصول على أفضل كربنة."
        }
      },
      ingredients: {
        strawberryLemonSyrup: "شراب الفراولة والليمون",
        cherryColaSyrup: "شراب كرز الكولا",
        blueRaspberrySyrup: "شراب التوت الأزرق",
        limeSyrup: "شراب الليمون",
        orangeSyrup: "شراب البرتقال",
        vanillaSyrup: "شراب الفانيليا",
        grapeSyrup: "شراب العنب",
        sparklingWater: "الماء الفوار",
        freshLemon: "ليمون طازج",
        freshBlueberries: "توت أزرق طازج",
        mint: "نعناع",
        mintLeaves: "أوراق النعناع",
        sugar: "سكر",
        cream: "كريمة",
        ice: "ثلج"
      },
      tags: {
        refreshing: "منعش",
        summer: "صيفي",
        popular: "شائع",
        classic: "كلاسيكي",
        bold: "جريء",
        fizzy: "فوار",
        berry: "توت",
        gourmet: "ذواقة",
        citrus: "حمضي",
        mojito: "موهيتو",
        fresh: "طازج",
        creamy: "كريمي",
        orange: "برتقالي",
        dessert: "حلويات",
        grape: "عنب",
        simple: "بسيط"
      },
      recipeCard: {
        reviews: "تقييمات",
        ingredients: "مكونات",
        viewRecipe: "عرض الوصفة"
      },
      allRecipes: {
        title: "جميع الوصفات",
        description: "اكتشف مجموعتنا الكاملة من وصفات المشروبات اللذيذة"
      },
      newsletter: {
        title: "احصل على وصفات جديدة أسبوعياً",
        description: "اشترك في نشرتنا الإخبارية واحصل على وصفات مشروبات جديدة ونصائح وعروض حصرية كل أسبوع!",
        emailPlaceholder: "أدخل بريدك الإلكتروني",
        subscribe: "اشتراك"
      },
      difficultyLevels: {
        title: "مستويات صعوبة الوصفات",
        subtitle: "اختر الوصفات التي تناسب مستوى مهارتك وخبرتك",
        beginner: {
          title: "مبتدئ",
          description: "مثالي للمبتدئين في صنع المشروبات الفوارة",
          feature1: "مكونات بسيطة",
          feature2: "تقنيات أساسية",
          feature3: "تحضير سريع"
        },
        intermediate: {
          title: "متوسط",
          description: "ممتاز لمن لديهم بعض الخبرة",
          feature1: "مكونات متعددة",
          feature2: "زخرفة أساسية",
          feature3: "تركيبات نكهات"
        },
        advanced: {
          title: "متقدم",
          description: "لصناع المشروبات ذوي الخبرة",
          feature1: "وصفات معقدة",
          feature2: "تقنيات متقدمة",
          feature3: "عروض إبداعية"
        }
      },
      seasonalRecipes: {
        title: "مجموعات الوصفات الموسمية",
        subtitle: "اكتشف وصفات مثالية لكل موسم",
        spring: {
          title: "الربيع",
          description: "نكهات خفيفة ومنعشة"
        },
        summer: {
          title: "الصيف",
          description: "تركيبات باردة واستوائية"
        },
        autumn: {
          title: "الخريف",
          description: "نكهات دافئة ومريحة"
        },
        winter: {
          title: "الشتاء",
          description: "مشروبات غنية ومريحة"
        }
      },
      communityRecipes: {
        title: "وصفات المجتمع",
        subtitle: "وصفات مذهلة شاركها مجتمعنا",
        tropicalParadise: {
          title: "الجنة الاستوائية",
          description: "مزيج منعش من الفواكه الاستوائية مع لمسة من جوز الهند",
          by: "بواسطة سارة م.",
          verified: "موثق"
        },
        berryBlast: {
          title: "انفجار التوت",
          description: "انفجار التوت المختلط مع النعناع والليمون",
          by: "بواسطة أحمد ك.",
          verified: "موثق"
        },
        submitYourRecipe: "أرسل وصفتك"
      },
      nutritionalInfo: {
        title: "المعلومات الغذائية",
        subtitle: "تعرف على الفوائد الصحية والمحتوى الغذائي لمشروباتنا",
        calorieUnit: "سعرات حرارية",
        calorieContent: {
          title: "محتوى السعرات الحرارية",
          plainSparklingWater: "الماء الفوار العادي",
          withNaturalSyrup: "مع الشراب الطبيعي",
          premiumSyrupMix: "مزيج الشراب الممتاز"
        },
        healthBenefits: {
          title: "الفوائد الصحية",
          benefit1: "ترطيب بدون سكريات مضافة",
          benefit2: "نكهات طبيعية من مكونات حقيقية",
          benefit3: "بديل منخفض السعرات الحرارية للمشروبات الغازية"
        },
        allergenInfo: {
          title: "معلومات الحساسية",
          info1: "جميع الشرابات خالية من الغلوتين",
          info2: "مصنوعة من مكونات طبيعية",
          info3: "بدون مواد حافظة اصطناعية"
        }
      }
    },
    common: {
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      success: "نجح!",
      close: "إغلاق",
      next: "التالي",
      previous: "السابق",
      search: "بحث",
      filter: "تصفية",
      clear: "مسح",
      apply: "تطبيق",
      cancel: "إلغاء",
      save: "حفظ",
      changeToArabic: "التغيير إلى العربية",
      changeToEnglish: "Change to English",
      openMenu: "فتح القائمة",
      closeMenu: "إغلاق القائمة",
      edit: "تعديل",
      delete: "حذف",
      view: "عرض",
      add: "إضافة",
      remove: "إزالة",
      quantity: "الكمية",
      total: "المجموع",
      subtotal: "المجموع الفرعي",
      shipping: "الشحن",
      tax: "الضريبة",
      discount: "الخصم",
      checkout: "إتمام الشراء",
      continue: "متابعة",
      back: "رجوع",
      home: "الرئيسية",
      about: "حول",
      services: "الخدمات",
      blog: "المدونة",
      privacy: "الخصوصية",
      terms: "الشروط",
      cookies: "ملفات تعريف الارتباط"
    },
    refill: {
      loadingTitle: "جارٍ تحميل أسطوانات CO2...",
      loadingSubtitle: "يرجى الانتظار بينما نسترجع أحدث معلومات الأسطوانات.",
      errorTitle: "تعذر تحميل بيانات الأسطوانات",
      retry: "إعادة المحاولة",
      carousel: { goTo: "اذهب إلى الشريحة" },
      choose: { heading: "اختر أسطوانتك", subheading: "اختر نوع الأسطوانة", needHelp: "تحتاج مساعدة؟", drinkmate: "درينك ميت", nonDrinkmate: "ليست درينك ميت", brandPlaceholder: "اختر علامتك التجارية", standardThreaded: "مدخل لولي" },
      qty: { title: "الكمية", subtitle: "اختر عدد الأسطوانات لإعادة التعبئة/التبديل", label: "عدد الأسطوانات لإعادة التعبئة/التبديل", returnNote: "يرجى إرجاع {{count}} أسطوانة فارغة", deliveryInfo: "وقت التسليم المتوقع:", deliveryTime: "3-5 أيام عمل", freeDeliveryNote: "توصيل مجاني لـ 3 أسطوانات أو أكثر", freeDeliveryNote2Plus: "اطلب 2 أسطوانة أو أكثر للحصول على توصيل مجاني", cylinder: "أسطوانة", emptyCylinders: "أسطوانة فارغة" },
      discounts: { twoPlus: "خصم 5%", twoPlusLabel: "2+ أسطوانات", threePlus: "خصم 10%", threePlusLabel: "3+ أسطوانات", fourPlus: "خصم 15%", fourPlusLabel: "+ تسليم مجاني", active: "✓ نشط" },
      offers: { heading: "استفد من الفرصة الآن", buy3FreeDelivery: "اشترِ 2+ توصيل مجاني", buyXFreeDelivery: "اشترِ {{count}}+ توصيل مجاني", buy4PriceEach: "اشترِ 4 بسعر 59/- لكل واحدة", addOneMoreForOffer: "أضف {{count}} أسطوانة أخرى للحصول على هذا العرض", addMoreForFreeDelivery: "أضف {{count}} أسطوانة أخرى للحصول على توصيل مجاني", returnNoteShort: "يرجى إرجاع {{count}} أسطوانة" },
      cta: { addToCart: "أضف الأسطوانات إلى السلة", subscribe: "اشترك ووفر 20%", premium: "عضوية مميزة" },
      why: { title: "لماذا تختار خدمتنا؟", f1: "CO2 صالح للاستخدام الغذائي", f2: "دورة 3-5 أيام", f3: "استلام وتسليم من المنزل", f4: "جودة مضمونة" },
      summary: { unitPrice: "سعر الوحدة:", subtotal: "المجموع الفرعي", delivery: "التسليم:", free: "مجاني", youSave: "توفير:", total: "المجموع:", pickupNote: "* سيتم استلام الأسطوانات الفارغة من موقعك", requiredReturn: "مطلوب إرجاع:", deliveryTime: "وقت التسليم:", co2RefillExchange: "إعادة تعبئة/تبديل أسطوانة CO2" },
      tabs: { faqs: "الأسئلة الشائعة", description: "الوصف", reviews: "التقييمات", faqsTitle: "الأسئلة الشائعة", faqsSubtitle: "كل ما تحتاج لمعرفته حول خدمة الأسطوانات المميزة", productDescription: "وصف المنتج", keyFeatures: "الميزات الرئيسية:", customerReviews: "آراء العملاء" },
      howItWorks: {
        step1: { title: "اطلب عبر الإنترنت", description: "اختر نوع الأسطوانة والكمية، ثم ضع طلبك عبر موقعنا الإلكتروني بنقرة واحدة.", label: "اطلب عبر الإنترنت" },
        step2: { title: "جدولة الاستلام", description: "سنحدد وقت مناسب لاستلام الأسطوانات الفارغة من موقعك بدون تكلفة إضافية.", label: "جدولة الاستلام" },
        step3: { title: "استلام الأسطوانات المعاد تعبئتها", description: "احصل على أسطوانات CO2 المعاد تعبئتها حديثاً على باب منزلك خلال 3-5 أيام عمل، جاهزة للاستخدام.", label: "استلام المعاد تعبئته" }
      },
      faqs: {
        q1: "كم من الوقت تستغرق عملية إعادة التعبئة/التبديل؟",
        a1: "مدة التوصيل لدينا تتراوح بين 3–5 أيام عمل من الاستلام إلى التسليم. سنحدد وقت استلام مناسب ونخطرك عندما تكون أسطواناتك المعاد تعبئتها جاهزة للتسليم.",
        q2: "ما العلامات التجارية للأسطوانات التي تقبلونها؟",
        a2: "نقبل أسطوانات من جميع العلامات التجارية الرئيسية بما في ذلك درينكميت، سوداستريم، إيرفا، فووار، فيليبس، والعديد من العلامات الأخرى. إذا لم تكن متأكداً من التوافق، يرجى الاتصال بفريق الدعم لدينا.",
        q3: "هل CO2 صالح للاستخدام الغذائي وآمن؟",
        a3: "نعم، نستخدم فقط CO2 مميز صالح للاستخدام الغذائي يلبي جميع معايير السلامة والجودة للاستخدام في المشروبات. كل أسطوانة يتم اختبارها وملؤها وفقاً للوائح الصناعة.",
        q4: "هل أحتاج لإرجاع نفس عدد الأسطوانات؟",
        a4: "نعم، يرجى التأكد من إرجاع نفس عدد الأسطوانات الفارغة التي تطلبها معاد تعبئتها. هذا يساعدنا في الحفاظ على برنامج التبديل بكفاءة.",
        q5: "ما خصومات الكمية المتاحة؟",
        a5: "نقدم تسعيراً متدرجاً على أسطوانات CO₂. استمتع بتوصيل مجاني عند شراء 3 أسطوانات أو أكثر. عند شراء 4 أسطوانات أو أكثر، ينخفض السعر إلى 59 ريالاً لكل أسطوانة بدلاً من 65 ريالاً، مع التوصيل المجاني مشمولاً."
      },
      carouselDescription: { refill4: "الآن أعد تعبئة 4 أسطوانات معاً بسعر {amount} لكل أسطوانة." }
    },
    cart: {
      title: "سلة التسوق",
      loading: "جاري تحميل السلة...",
      error: "حدث خطأ",
      retry: "إعادة المحاولة",
      empty: "سلتك فارغة",
      emptyDescription: "أضف بعض العناصر إلى سلة التسوق للبدء",
      continueShopping: "متابعة التسوق",
      orderSummary: "ملخص الطلب",
      taxesNote: "سيتم احتساب الضرائب وأكواد الخصم عند الدفع",
      coupon: { enter: "يرجى إدخال رمز الكوبون", applied: "تم تطبيق الكوبون بنجاح", invalid: "رمز الكوبون غير صالح" },
      removeItem: "إزالة العنصر",
      updateQuantity: "تحديث الكمية",
      subtotal: "المجموع الفرعي",
      shipping: "الشحن",
      tax: "الضريبة",
      total: "المجموع",
      vatIncluded: "(شامل ضريبة القيمة المضافة)",
      freeShipping: "مجاني",
      freeShippingThreshold: "شحن مجاني للطلبات فوق 150 ريال",
      checkout: "إتمام الشراء",
      quantity: "الكمية",
      price: "السعر",
      totalItems: "إجمالي العناصر"
    },
    checkout: {
      title: "إتمام الشراء",
      billingInformation: "معلومات الفواتير",
      shippingInformation: "معلومات الشحن",
      paymentMethod: "طريقة الدفع",
      orderSummary: "ملخص الطلب",
      placeOrder: "تأكيد الطلب",
      processingPayment: "جاري معالجة الدفع...",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      city: "المدينة",
      district: "الحي",
      nationalAddress: "العنوان الوطني",
      deliveryOptions: "خيارات التوصيل",
      standardDelivery: "التوصيل العادي",
      expressDelivery: "التوصيل السريع",
      orderNotes: "ملاحظات الطلب",
      agreeToTerms: "أوافق على الشروط والأحكام",
      shipToDifferent: "الشحن إلى عنوان مختلف",
      termsPrefix: "أوافق على",
      termsLink: "الشروط والأحكام",
      required: "مطلوب",
      optional: "اختياري",
      shippingCost: "الشحن",
      taxIncluded: "(شامل ضريبة القيمة المضافة)",
      country: "الدولة",
      deliveryInformation: "معلومات التوصيل",
      shippingAddress: "عنوان الشحن",
      shortAddress: "العنوان المختصر",
      shortAddressFormat: "الصيغة: 4 أحرف متبوعة بـ 4 أرقام (مثل: JESA3591)",
      featuredProducts: "المنتجات المميزة",
      quantity: "الكمية",
      price: "السعر",
      couponCode: "كود الخصم",
      apply: "تطبيق",
      discount: "الخصم",
      currency: "ريال",
      tabby: {
        name: "تابي",
        tagline: "قسّمه على 4. بدون أي فوائد أو رسوم.",
        benefits: {
          noInterest: "بدون فوائد",
          noFees: "بدون رسوم",
          payLater: "ادفع لاحقاً"
        }
      },
      newBadge: "جديد",
      privacyNote: "سيتم استخدام بياناتك الشخصية لمعالجة طلبك ودعم تجربتك عبر هذا الموقع ولأغراض أخرى موضحة في",
      privacyPolicy: "سياسة الخصوصية",
      guestNotice: "أنت تقوم بإتمام الشراء كضيف.",
      login: "تسجيل الدخول",
      guestSuffix: "لحفظ معلوماتك للمرة القادمة.",
      loggedInAs: "تم تسجيل الدخول كـ",
      validation: {
        fullNameRequired: "يرجى إدخال الاسم الكامل",
        fullNameMinLength: "يجب أن يكون الاسم الكامل على الأقل حرفين",
        fullNameInvalid: "يمكن أن يحتوي الاسم الكامل على الأحرف والمسافات فقط",
        phoneRequired: "يرجى إدخال رقم الهاتف",
        phoneInvalid: "يمكن أن يحتوي رقم الهاتف على الأرقام فقط",
        phoneLength: "يجب أن يكون رقم الهاتف بين 9 و 15 رقم",
        districtRequired: "يرجى إدخال الحي",
        districtMinLength: "يجب أن يكون الحي على الأقل حرفين",
        cityRequired: "يرجى إدخال المدينة",
        cityMinLength: "يجب أن تكون المدينة على الأقل حرفين",
        emailRequired: "يرجى إدخال البريد الإلكتروني",
        emailInvalid: "يرجى إدخال عنوان بريد إلكتروني صحيح",
        nationalAddressLength: "يجب أن يكون العنوان الوطني 8 أحرف بالضبط",
        nationalAddressFormat: "يجب أن يكون العنوان الوطني 4 أحرف متبوعة بـ 4 أرقام (مثل: JESA3591)",
        pleaseFixErrors: "يرجى إصلاح الأخطاء في النموذج",
        agreeToTerms: "يرجى الموافقة على الشروط والأحكام"
      }
    },
    auth: {
      createAccount: "إنشاء حساب",
      joinDrinkmate: "انضم إلى درينك ميت وابدأ رحلتك الغازية",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      agreeToTerms: "أوافق على الشروط والأحكام وسياسة الخصوصية",
      alreadyHaveAccount: "هل لديك حساب بالفعل؟",
      signIn: "تسجيل الدخول",
      dontHaveAccount: "ليس لديك حساب؟",
      signUp: "إنشاء حساب",
      forgotPassword: "نسيت كلمة المرور؟",
      resetPassword: "إعادة تعيين كلمة المرور",
      passwordRequirements: "متطلبات كلمة المرور",
      passwordMustContain: "يجب أن تحتوي كلمة المرور على:",
      atLeast8Characters: "8 أحرف على الأقل",
      oneUppercaseLetter: "حرف كبير واحد",
      oneLowercaseLetter: "حرف صغير واحد",
      oneNumber: "رقم واحد",
      oneSpecialCharacter: "رمز خاص واحد",
      passwordsMustMatch: "يجب أن تتطابق كلمات المرور",
      termsAndConditions: "الشروط والأحكام",
      privacyPolicy: "سياسة الخصوصية"
    },
    product: {
      inStock: "متوفر",
      outOfStock: "نفد المخزون",
      onlyLeftInStock: "بقي {count} فقط في المخزون!",
      stockCount: "{count} متوفر",
      addToCart: "أضف إلى السلة",
      buyNow: "اشتر الآن",
      addToWishlist: "أضف إلى المفضلة",
      removeFromWishlist: "إزالة من المفضلة",
      share: "مشاركة",
      notifyMe: "أخبرني",
      writeReview: "اكتب مراجعة",
      askQuestion: "اسأل سؤال",
      description: "الوصف",
      specifications: "المواصفات",
      reviews: "المراجعات",
      questions: "الأسئلة",
      relatedProducts: "المنتجات ذات الصلة",
      youMayAlsoLike: "قد يعجبك أيضاً",
      frequentlyAskedQuestions: "الأسئلة الشائعة",
      customerReviews: "مراجعات العملاء",
      save: "وفر",
      goToCart: "اذهب إلى السلة",
      quantity: "الكمية",
      keyFeatures: "الميزات الرئيسية",
      technicalSpecifications: "المواصفات التقنية",
      allReviews: "جميع المراجعات",
      allQuestions: "جميع الأسئلة",
      usageFeatures: "الاستخدام والميزات",
      installationSetup: "التثبيت والإعداد",
      warrantySupport: "الضمان والدعم",
      sold: "مباع",
      reviewsCount: "مراجعة",
      questionsCount: "سؤال",
      defaultSafety1: "مختبرة ومعتمدة من حيث الجودة",
      defaultSafety2: "آمنة للاستخدام اليومي",
      writeAReview: "اكتب مراجعة",
      askAQuestion: "اسأل سؤال",
      submitReview: "إرسال المراجعة",
      submitQuestion: "إرسال السؤال",
      rating: "التقييم",
      helpful: "مفيد",
      notHelpful: "غير مفيد",
      report: "الإبلاغ",
      sortBy: "ترتيب حسب",
      filterBy: "تصفية حسب",
      newest: "الأحدث",
      oldest: "الأقدم",
      highestRated: "الأعلى تقييماً",
      lowestRated: "الأقل تقييماً",
      all: "الكل",
      verified: "موثق",
      recommended: "موصى به",
      pros: "الإيجابيات",
      cons: "السلبيات",
      wouldRecommend: "هل تنصح بهذا المنتج؟",
      yes: "نعم",
      no: "لا",
      safetyQuality: "السلامة والجودة",
      estimatedDelivery: "موعد التسليم المتوقع:",
      options: "خيارات المنتج",
      notifyWhenAvailable: "أبلغني عند التوفر",
      loadingDetails: "جاري تحميل تفاصيل المنتج...",
      preparingExperience: "نحضّر لك أفضل تجربة",
      defaultFeature: "مواد عالية الجودة",
      badges: {
        bestSeller: "الأكثر مبيعاً",
        new: "جديد",
        ecoFriendly: "صديق للبيئة"
      },
      quickView: "عرض سريع",
      compareProducts: "مقارنة المنتجات",
      videos: "الفيديوهات",
      qa: "الأسئلة والأجوبة",
      material: "المادة",
      dimensions: "الأبعاد",
      weight: "الوزن",
      certifications: "الشهادات",
      warranty: "الضمان",
      compatibility: "التوافق",
      notFoundTitle: "المنتج غير موجود",
      notFoundDescription: "المنتج الذي تبحث عنه غير موجود أو تم إزالته.",
      backToShop: "العودة إلى المتجر",
      goBack: "العودة",
      backToHome: "العودة إلى الرئيسية",
      backToAccessories: "العودة إلى الملحقات",
      backToSodaMakers: "العودة إلى صانعات الصودا",
      premium: "فاخر",
      standard: "قياسي",
      lightweight: "خفيف الوزن"
    },
    footer: {
      companyDescription: "إنشاء مشروبات غازية مثالية في المنزل مع النكهات الإيطالية عالية الجودة وصانعات الصودا المبتكرة",
      phone: "+966544671166",
      email: "cs@aqualine.sa.com",
      address: "الرياض، المملكة العربية السعودية",
      products: {
        title: "المنتجات",
        sodaMakers: "صانعات الصودا درينك ميت",
        co2Cylinders: "ثاني أكسيد الكربون",
        italianSyrups: "سيروبات الإيطالية عالية الجودة",
        accessories: "الملحقات",
        giftBundles: "هدايا للعائلة والأصدقاء",
        bulkOrders: "طلب بالجملة"
      },
      information: {
        title: "المعلومات",
        support: "الدعم",
        reprintReturnLabel: "إعادة طباعة ملصق الإرجاع",
        legalTerms: "الشروط القانونية",
        privacyPolicy: "سياسة الخصوصية",
        cookiePolicy: "سياسة ملفات تعريف الارتباط",
        drinkmateRecipe: "وصفات درينك ميت",
        blogs: "المدونات"
      },
      more: {
        title: "المزيد",
        trackOrder: "تتبع الطلب"
      },
      newsletter: {
        title: "ابق منعشاً مع درينك ميت",
        emailPlaceholder: "أدخل عنوان بريدك الإلكتروني",
        subscribeButton: "اشترك في النشرة الإخبارية",
        disclaimer: "احصل على عروض حصرية على صانعات الصودا والنكهات وإعادة تعبئة ثاني أكسيد الكربون"
      },
      social: {
        followUs: "تابعنا"
      },
      payment: {
        title: "طرق الدفع المقبولة"
      },
      delivery: {
        title: "شريك التوصيل"
      },
      copyright: "© 2024 درينك ميت. جميع الحقوق محفوظة."
    }
  }
};
