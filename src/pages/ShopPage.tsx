import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { ProductCard } from '../components/shop/ProductCard';
import { FilterPanel } from '../components/shop/FilterPanel';
import { SEOHead } from '../components/common/SEOHead';
import { Filter, Search, X, RotateCcw } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { selectedCategoryFilter, setSelectedCategoryFilter, products: storeProducts, categories: storeCategories } = useStore();
  const activeProducts = storeProducts && storeProducts.length > 0 ? storeProducts : products;
  const activeCategories = storeCategories && storeCategories.length > 0 ? storeCategories : categories;

  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([800, 5500]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Toggle size
  const handleToggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Reset filters
  const handleClearFilters = () => {
    setSelectedCategoryFilter('all');
    setSearchQuery('');
    setPriceRange([800, 5500]);
    setSelectedSizes([]);
    setSortBy('featured');
  };

  // Filtered & Sorted items
  const filteredProducts = useMemo(() => {
    return activeProducts.filter((p) => {
      // Category
      if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Price
      if (p.price > priceRange[1]) {
        return false;
      }
      // Sizes
      if (selectedSizes.length > 0) {
        const hasSize = p.sizes.some((s) => selectedSizes.includes(s));
        if (!hasSize) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [activeProducts, selectedCategoryFilter, searchQuery, priceRange, selectedSizes, sortBy]);

  const activeCategoryObj = activeCategories.find((c) => c.id === selectedCategoryFilter);

  return (
    <div style={{ backgroundColor: '#071b13', minHeight: '100vh', padding: '2rem 0 5rem 0' }}>
      <SEOHead
        title={activeCategoryObj ? `تسوق ${activeCategoryObj.name}` : 'المتجر الكامل للأزياء النسائية'}
        description="تصفحي أحدث تشكيلة من الأزياء والفساتين الراقية من مؤمن سنتر. تصفية حسب المقاس والسعر والنوع مع خدمة الشحن السريع لكافة المحافظات."
      />

      <div className="container">
        {/* Breadcrumb & Title Banner */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div className="section-tag">
            <span>دار مؤمن سنتر — كتالوج 2026</span>
          </div>
          <h1 className="section-title">
            {activeCategoryObj ? activeCategoryObj.name : 'كافة المجموعات والتشكيلات'}
          </h1>
          <p className="section-subtitle">
            {activeCategoryObj
              ? activeCategoryObj.description
              : 'اكتشفي تشكيلتنا المتكاملة من الفساتين، البلوزات، البناطيل، والجاكيتات المصممة بأعلى معايير الهوت كوتور.'}
          </p>
        </div>

        {/* Search & Mobile Filter Bar */}
        <div
          style={{
            background: 'rgba(17, 51, 36, 0.5)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* Search Field */}
          <div
            style={{
              flex: 1,
              minWidth: '240px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(7, 27, 19, 0.8)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-full)',
              padding: '0.5rem 1rem'
            }}
          >
            <Search size={16} color="var(--gold-400)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحثي بالاسم، الخامة أو التفاصيل..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.88rem'
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Results count & Mobile filter trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              تم العثور على <strong style={{ color: 'var(--gold-300)' }}>{filteredProducts.length}</strong> قطعة
            </span>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="btn-outline-gold lg:hidden"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Filter size={15} />
              <span>الفلاتر والترتيب</span>
            </button>
          </div>
        </div>

        {/* Main Layout: Sidebar Filter + Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: '2rem',
            alignItems: 'start'
          }}
          className="shop-layout"
        >
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterPanel
              selectedCategory={selectedCategoryFilter}
              onSelectCategory={setSelectedCategoryFilter}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedSizes={selectedSizes}
              onToggleSize={handleToggleSize}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
              totalResults={filteredProducts.length}
            />
          </div>

          {/* Products Column */}
          <div>
            {/* Active Filters Bar */}
            {(selectedCategoryFilter !== 'all' || selectedSizes.length > 0 || priceRange[1] < 5500 || searchQuery) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  marginBottom: '1.5rem',
                  padding: '0.75rem',
                  background: 'rgba(17, 51, 36, 0.3)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>الفلاتر النشطة:</span>

                {selectedCategoryFilter !== 'all' && (
                  <span
                    onClick={() => setSelectedCategoryFilter('all')}
                    style={{
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid var(--gold-500)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.2rem 0.65rem',
                      fontSize: '0.75rem',
                      color: 'var(--gold-300)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span>{activeCategoryObj?.name}</span>
                    <X size={12} />
                  </span>
                )}

                {selectedSizes.map((s) => (
                  <span
                    key={s}
                    onClick={() => handleToggleSize(s)}
                    style={{
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid var(--gold-500)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.2rem 0.65rem',
                      fontSize: '0.75rem',
                      color: 'var(--gold-300)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span>مقاس: {s}</span>
                    <X size={12} />
                  </span>
                ))}

                <button
                  onClick={handleClearFilters}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  مسح الكل
                </button>
              </div>
            )}

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  background: 'rgba(17, 51, 36, 0.3)',
                  border: '1px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '4rem 2rem',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                    color: 'var(--gold-400)'
                  }}
                >
                  <Search size={26} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  لم يتم العثور على قطع تطابق الفلاتر المحددة
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  يرجى تجربة تقليل نطاق الفلاتر أو إعادة ضبط البحث للاطلاع على كافة الموديلات المتاحة.
                </p>
                <button onClick={handleClearFilters} className="btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.9rem' }}>
                  <RotateCcw size={16} />
                  <span>إعادة ضبط كافة الفلاتر</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <FilterPanel
            selectedCategory={selectedCategoryFilter}
            onSelectCategory={setSelectedCategoryFilter}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedSizes={selectedSizes}
            onToggleSize={handleToggleSize}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
            totalResults={filteredProducts.length}
            isMobileDrawer={true}
            onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
          />
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .shop-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
