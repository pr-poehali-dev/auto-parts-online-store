import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  article: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: string;
  compatibility: string[];
  inStock: boolean;
  image: string;
  isPromo?: boolean;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Тормозные колодки передние',
    article: 'BRP-2341',
    brand: 'Brembo',
    price: 3500,
    originalPrice: 4200,
    category: 'Тормозная система',
    compatibility: ['Volkswagen', 'Audi', 'Skoda'],
    inStock: true,
    image: '/placeholder.svg',
    isPromo: true
  },
  {
    id: 2,
    name: 'Масляный фильтр',
    article: 'OF-8891',
    brand: 'Mann Filter',
    price: 890,
    category: 'Фильтры',
    compatibility: ['Toyota', 'Lexus', 'Honda'],
    inStock: true,
    image: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Амортизатор задний',
    article: 'SHK-7712',
    brand: 'Bilstein',
    price: 7200,
    category: 'Подвеска',
    compatibility: ['BMW', 'Mercedes-Benz'],
    inStock: true,
    image: '/placeholder.svg'
  },
  {
    id: 4,
    name: 'Свечи зажигания комплект',
    article: 'SP-4455',
    brand: 'NGK',
    price: 1200,
    originalPrice: 1500,
    category: 'Система зажигания',
    compatibility: ['Nissan', 'Mazda', 'Mitsubishi'],
    inStock: true,
    image: '/placeholder.svg',
    isPromo: true
  },
  {
    id: 5,
    name: 'Генератор 120A',
    article: 'GEN-9934',
    brand: 'Bosch',
    price: 12500,
    category: 'Электрика',
    compatibility: ['Ford', 'Chevrolet'],
    inStock: false,
    image: '/placeholder.svg'
  },
  {
    id: 6,
    name: 'Радиатор охлаждения',
    article: 'RAD-5522',
    brand: 'NRF',
    price: 8900,
    category: 'Система охлаждения',
    compatibility: ['Renault', 'Peugeot', 'Citroen'],
    inStock: true,
    image: '/placeholder.svg'
  }
];

const categories = [
  { name: 'Тормозная система', icon: 'Disc3', count: 234 },
  { name: 'Двигатель', icon: 'Gauge', count: 456 },
  { name: 'Подвеска', icon: 'Settings2', count: 189 },
  { name: 'Электрика', icon: 'Zap', count: 312 },
  { name: 'Фильтры', icon: 'Filter', count: 145 },
  { name: 'Масла', icon: 'Droplet', count: 98 }
];

const brands = ['Bosch', 'Brembo', 'Mann Filter', 'NGK', 'Bilstein', 'NRF'];

export default function Index() {
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'about' | 'contacts' | 'delivery' | 'promo'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCompatibility, setSelectedCompatibility] = useState('');

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.article.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesCompatibility = !selectedCompatibility || product.compatibility.includes(selectedCompatibility);
    
    return matchesSearch && matchesPrice && matchesBrand && matchesCompatibility;
  });

  const promoProducts = mockProducts.filter(p => p.isPromo);

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <Icon name="Wrench" className="text-primary" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-primary">AutoParts</h1>
                <p className="text-xs text-muted-foreground">Ваш надежный поставщик</p>
              </div>
            </div>

            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Поиск по артикулу или названию..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value) setCurrentPage('catalog');
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setCurrentPage('home')}>
                <Icon name="Home" size={20} />
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                    <SheetDescription>
                      {cartCount === 0 ? 'Ваша корзина пуста' : `Товаров в корзине: ${cartCount}`}
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {cartItems.map(item => (
                      <Card key={item.product.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{item.product.name}</h4>
                              <p className="text-xs text-muted-foreground">{item.product.article}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                  <Icon name="Minus" size={14} />
                                </Button>
                                <span className="text-sm font-medium">{item.quantity}</span>
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                  <Icon name="Plus" size={14} />
                                </Button>
                                <Button size="sm" variant="ghost" className="ml-auto" onClick={() => removeFromCart(item.product.id)}>
                                  <Icon name="Trash2" size={14} />
                                </Button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{item.product.price * item.quantity} ₽</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {cartCount > 0 && (
                    <div className="mt-6 space-y-4">
                      <Separator />
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Итого:</span>
                        <span>{cartTotal} ₽</span>
                      </div>
                      <Button className="w-full" size="lg">
                        Оформить заказ
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="mt-4 md:hidden">
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Поиск..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) setCurrentPage('catalog');
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            <Button variant={currentPage === 'home' ? 'default' : 'ghost'} onClick={() => setCurrentPage('home')}>
              Главная
            </Button>
            <Button variant={currentPage === 'catalog' ? 'default' : 'ghost'} onClick={() => setCurrentPage('catalog')}>
              Каталог
            </Button>
            <Button variant={currentPage === 'promo' ? 'default' : 'ghost'} onClick={() => setCurrentPage('promo')}>
              Акции
            </Button>
            <Button variant={currentPage === 'delivery' ? 'default' : 'ghost'} onClick={() => setCurrentPage('delivery')}>
              Доставка
            </Button>
            <Button variant={currentPage === 'about' ? 'default' : 'ghost'} onClick={() => setCurrentPage('about')}>
              О нас
            </Button>
            <Button variant={currentPage === 'contacts' ? 'default' : 'ghost'} onClick={() => setCurrentPage('contacts')}>
              Контакты
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <div className="space-y-12 animate-fade-in">
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 p-8 md:p-12">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Качественные автозапчасти для вашего автомобиля
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Более 10 000 наименований от проверенных поставщиков. Доставка по всей России.
                </p>
                <div className="flex gap-3">
                  <Button size="lg" onClick={() => setCurrentPage('catalog')}>
                    <Icon name="Search" className="mr-2" size={20} />
                    Перейти в каталог
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setCurrentPage('promo')}>
                    <Icon name="Percent" className="mr-2" size={20} />
                    Акции
                  </Button>
                </div>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
                <Icon name="Settings" className="absolute right-12 top-12 text-primary" size={120} />
                <Icon name="Wrench" className="absolute right-32 bottom-12 text-secondary" size={80} />
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-6">Популярные категории</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat, index) => (
                  <Card 
                    key={index} 
                    className="hover-lift cursor-pointer group"
                    onClick={() => setCurrentPage('catalog')}
                  >
                    <CardContent className="p-6 text-center">
                      <Icon 
                        name={cat.icon as any} 
                        className="mx-auto mb-3 text-primary group-hover:text-secondary transition-colors" 
                        size={40} 
                      />
                      <h4 className="font-semibold text-sm mb-1">{cat.name}</h4>
                      <p className="text-xs text-muted-foreground">{cat.count} товаров</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold">Акции и специальные предложения</h3>
                <Button variant="outline" onClick={() => setCurrentPage('promo')}>
                  Все акции
                  <Icon name="ArrowRight" className="ml-2" size={16} />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promoProducts.map(product => (
                  <Card key={product.id} className="hover-lift">
                    <CardHeader className="pb-3">
                      <div className="relative">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
                        <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
                          -15%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="mb-2">{product.brand}</Badge>
                      <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                      <CardDescription className="mb-3">{product.article}</CardDescription>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">{product.originalPrice} ₽</span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => addToCart(product)}>
                        <Icon name="ShoppingCart" className="mr-2" size={16} />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Icon name="Truck" className="mx-auto mb-3 text-primary" size={48} />
                  <h4 className="font-bold mb-2">Быстрая доставка</h4>
                  <p className="text-sm text-muted-foreground">Доставим заказ в течение 1-3 дней по всей России</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Icon name="ShieldCheck" className="mx-auto mb-3 text-primary" size={48} />
                  <h4 className="font-bold mb-2">Гарантия качества</h4>
                  <p className="text-sm text-muted-foreground">Все товары сертифицированы и имеют гарантию</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Icon name="HeadphonesIcon" className="mx-auto mb-3 text-primary" size={48} />
                  <h4 className="font-bold mb-2">Поддержка 24/7</h4>
                  <p className="text-sm text-muted-foreground">Наши специалисты всегда готовы помочь с выбором</p>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {currentPage === 'catalog' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-6">Каталог автозапчастей</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Фильтры</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold mb-3 block">Цена</label>
                    <Slider
                      min={0}
                      max={20000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{priceRange[0]} ₽</span>
                      <span>{priceRange[1]} ₽</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-semibold mb-3 block">Бренды</label>
                    <div className="space-y-2">
                      {brands.map(brand => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox 
                            id={brand}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => toggleBrand(brand)}
                          />
                          <label htmlFor={brand} className="text-sm cursor-pointer">
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-semibold mb-3 block">Совместимость</label>
                    <Input 
                      placeholder="Введите марку авто"
                      value={selectedCompatibility}
                      onChange={(e) => setSelectedCompatibility(e.target.value)}
                    />
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setPriceRange([0, 20000]);
                      setSelectedBrands([]);
                      setSelectedCompatibility('');
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                </CardContent>
              </Card>

              <div className="lg:col-span-3">
                <div className="mb-4 text-sm text-muted-foreground">
                  Найдено товаров: {filteredProducts.length}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <Card key={product.id} className="hover-lift">
                      <CardHeader className="pb-3">
                        <div className="relative">
                          <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
                          {product.isPromo && (
                            <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
                              Акция
                            </Badge>
                          )}
                          {!product.inStock && (
                            <Badge className="absolute top-2 left-2" variant="destructive">
                              Под заказ
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline" className="mb-2">{product.brand}</Badge>
                        <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                        <CardDescription className="mb-1">{product.article}</CardDescription>
                        <p className="text-xs text-muted-foreground mb-3">
                          {product.compatibility.slice(0, 2).join(', ')}
                          {product.compatibility.length > 2 && '...'}
                        </p>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">{product.originalPrice} ₽</span>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                        >
                          <Icon name="ShoppingCart" className="mr-2" size={16} />
                          {product.inStock ? 'В корзину' : 'Уведомить о поступлении'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'promo' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">Акции и специальные предложения</h2>
              <p className="text-muted-foreground">Выгодные предложения на популярные запчасти</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promoProducts.map(product => (
                <Card key={product.id} className="hover-lift">
                  <CardHeader className="pb-3">
                    <div className="relative">
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
                      <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-lg px-3 py-1">
                        -15%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="mb-2">{product.brand}</Badge>
                    <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                    <CardDescription className="mb-3">{product.article}</CardDescription>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">{product.originalPrice} ₽</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Экономия: {product.originalPrice ? product.originalPrice - product.price : 0} ₽
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => addToCart(product)}>
                      <Icon name="ShoppingCart" className="mr-2" size={16} />
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'delivery' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">Доставка и оплата</h2>
              <p className="text-muted-foreground">Информация о способах доставки и оплаты заказов</p>
            </div>

            <Tabs defaultValue="delivery" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="delivery">Доставка</TabsTrigger>
                <TabsTrigger value="payment">Оплата</TabsTrigger>
              </TabsList>
              
              <TabsContent value="delivery" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Truck" className="text-primary" />
                      Курьерская доставка
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">Доставка по городу в течение 1-2 дней</p>
                    <p className="font-semibold">Стоимость: 500 ₽</p>
                    <p className="text-sm text-muted-foreground">Бесплатно при заказе от 10 000 ₽</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Package" className="text-primary" />
                      Транспортные компании
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">СДЭК, Деловые Линии, ПЭК</p>
                    <p className="font-semibold">Стоимость: рассчитывается индивидуально</p>
                    <p className="text-sm text-muted-foreground">Срок доставки: 2-7 дней в зависимости от региона</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="MapPin" className="text-primary" />
                      Самовывоз
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">Из нашего магазина по адресу: ул. Автомобильная, 15</p>
                    <p className="font-semibold">Бесплатно</p>
                    <p className="text-sm text-muted-foreground">Готовность заказа: в день оформления</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="CreditCard" className="text-primary" />
                      Банковские карты
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Принимаем карты Visa, MasterCard, МИР</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Wallet" className="text-primary" />
                      Наличные
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Оплата курьеру при получении или в магазине при самовывозе</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Building" className="text-primary" />
                      Банковский перевод
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Для юридических лиц с НДС. Отправим счет на электронную почту</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {currentPage === 'about' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">О компании</h2>
              <p className="text-muted-foreground">AutoParts - надежный поставщик автозапчастей с 2010 года</p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3">Наша миссия</h3>
                    <p className="text-muted-foreground">
                      Мы стремимся сделать обслуживание автомобиля простым и доступным для каждого. 
                      Предлагаем только качественные запчасти от проверенных производителей по справедливым ценам.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-bold mb-3">Наши преимущества</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex gap-3">
                        <Icon name="Check" className="text-primary flex-shrink-0" size={24} />
                        <div>
                          <h4 className="font-semibold mb-1">Большой ассортимент</h4>
                          <p className="text-sm text-muted-foreground">Более 10 000 наименований запчастей</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Icon name="Check" className="text-primary flex-shrink-0" size={24} />
                        <div>
                          <h4 className="font-semibold mb-1">Гарантия качества</h4>
                          <p className="text-sm text-muted-foreground">Все товары сертифицированы</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Icon name="Check" className="text-primary flex-shrink-0" size={24} />
                        <div>
                          <h4 className="font-semibold mb-1">Быстрая доставка</h4>
                          <p className="text-sm text-muted-foreground">Отправка в день заказа</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Icon name="Check" className="text-primary flex-shrink-0" size={24} />
                        <div>
                          <h4 className="font-semibold mb-1">Профессиональная помощь</h4>
                          <p className="text-sm text-muted-foreground">Консультации специалистов</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-bold mb-3">Наши цифры</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-4xl font-bold text-primary mb-2">14+</p>
                        <p className="text-sm text-muted-foreground">лет на рынке</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-primary mb-2">10K+</p>
                        <p className="text-sm text-muted-foreground">товаров</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-primary mb-2">5K+</p>
                        <p className="text-sm text-muted-foreground">клиентов</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-primary mb-2">98%</p>
                        <p className="text-sm text-muted-foreground">довольных</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentPage === 'contacts' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">Контакты</h2>
              <p className="text-muted-foreground">Свяжитесь с нами удобным способом</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="MapPin" className="text-primary" />
                    Адрес магазина
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold mb-1">г. Москва, ул. Автомобильная, 15</p>
                  <p className="text-sm text-muted-foreground">Режим работы: Пн-Пт 9:00-20:00, Сб-Вс 10:00-18:00</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Phone" className="text-primary" />
                    Телефон
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold mb-1">+7 (495) 123-45-67</p>
                  <p className="text-sm text-muted-foreground">Звоните с 9:00 до 21:00 (МСК)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Mail" className="text-primary" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold mb-1">info@autoparts.ru</p>
                  <p className="text-sm text-muted-foreground">Ответим в течение 24 часов</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="MessageCircle" className="text-primary" />
                    Мессенджеры
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold mb-1">WhatsApp / Telegram</p>
                  <p className="text-sm text-muted-foreground">+7 (495) 123-45-67</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Обратная связь</CardTitle>
                <CardDescription>Задайте вопрос или оставьте отзыв</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ваше имя</label>
                    <Input placeholder="Иван Иванов" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email или телефон</label>
                    <Input placeholder="ivan@example.com или +7 (999) 123-45-67" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Сообщение</label>
                    <textarea 
                      className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Ваш вопрос или комментарий..."
                    />
                  </div>
                  <Button className="w-full">
                    <Icon name="Send" className="mr-2" size={16} />
                    Отправить
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Wrench" className="text-primary" size={28} />
                <h3 className="text-xl font-bold">AutoParts</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Качественные автозапчасти с доставкой по всей России
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Каталог</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="cursor-pointer hover:text-primary transition-colors">Двигатель</p>
                <p className="cursor-pointer hover:text-primary transition-colors">Тормозная система</p>
                <p className="cursor-pointer hover:text-primary transition-colors">Подвеска</p>
                <p className="cursor-pointer hover:text-primary transition-colors">Электрика</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Информация</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="cursor-pointer hover:text-primary transition-colors" onClick={() => setCurrentPage('about')}>О компании</p>
                <p className="cursor-pointer hover:text-primary transition-colors" onClick={() => setCurrentPage('delivery')}>Доставка</p>
                <p className="cursor-pointer hover:text-primary transition-colors" onClick={() => setCurrentPage('contacts')}>Контакты</p>
                <p className="cursor-pointer hover:text-primary transition-colors" onClick={() => setCurrentPage('promo')}>Акции</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Контакты</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>+7 (495) 123-45-67</p>
                <p>info@autoparts.ru</p>
                <p>г. Москва, ул. Автомобильная, 15</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="text-center text-sm text-muted-foreground">
            © 2024 AutoParts. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
