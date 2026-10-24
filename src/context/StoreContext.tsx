import React, { createContext, useContext, useState, useEffect } from 'react';
import { Store, Product, Order, SubscriptionPlan, Subscription, OrderStatus, PaymentStatus } from '../types';
import { INITIAL_STORES, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PLANS, INITIAL_SUBSCRIPTIONS } from '../lib/mockData';
import { useAuth } from './AuthContext';

interface CanAddProductResult {
  allowed: boolean;
  currentCount: number;
  maxLimit: number;
  reason?: string;
}

interface StoreContextType {
  stores: Store[];
  activeStore: Store | null;
  activeStoreId: string;
  setActiveStoreId: (id: string) => void;
  getStoreBySlug: (slug: string) => Store | undefined;
  createStore: (storeData: Partial<Store>) => Store;
  updateStore: (id: string, updates: Partial<Store>) => void;
  deleteStore: (id: string) => void;
  toggleStoreStatus: (id: string) => void;

  products: Product[];
  getStoreProducts: (storeId: string) => Product[];
  addProduct: (productData: Omit<Product, 'id' | 'created_at'>) => { success: boolean; error?: string; product?: Product };
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  canAddProduct: (storeId: string) => CanAddProductResult;

  orders: Order[];
  getStoreOrders: (storeId: string) => Order[];
  getCustomerOrders: (email: string) => Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'created_at'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;

  plans: SubscriptionPlan[];
  subscriptions: Subscription[];
  currentSubscription: Subscription | null;
  currentPlan: SubscriptionPlan | null;
  upgradeSubscription: (planId: string, billingCycle: 'monthly' | 'yearly') => void;

  resetToDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STORES: 'storenova_stores_v1',
  PRODUCTS: 'storenova_products_v1',
  ORDERS: 'storenova_orders_v1',
  PLANS: 'storenova_plans_v1',
  SUBSCRIPTIONS: 'storenova_subscriptions_v1',
  ACTIVE_STORE_ID: 'storenova_active_store_id'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [stores, setStores] = useState<Store[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STORES);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_STORES;
  });

  const [activeStoreId, setActiveStoreId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_STORE_ID);
      if (saved && INITIAL_STORES.some(s => s.id === saved)) return saved;
    } catch {}
    return INITIAL_STORES[0].id;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_ORDERS;
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLANS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_PLANS;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_SUBSCRIPTIONS;
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STORE_ID, activeStoreId);
  }, [activeStoreId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
  }, [subscriptions]);

  const activeStore = stores.find(s => s.id === activeStoreId) || stores[0] || null;

  const currentSubscription = subscriptions.find(
    sub => (activeStore && sub.store_id === activeStore.id) || (user && sub.user_id === user.id)
  ) || subscriptions[0] || null;

  const currentPlan = plans.find(p => p.id === currentSubscription?.plan_id) || plans[1]; // default growth

  const getStoreBySlug = (slug: string) => {
    return stores.find(s => s.slug.toLowerCase() === slug.toLowerCase());
  };

  const createStore = (storeData: Partial<Store>): Store => {
    const rawSlug = storeData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `store-${Date.now()}`;
    let uniqueSlug = rawSlug;
    let counter = 1;
    while (stores.some(s => s.slug.toLowerCase() === uniqueSlug.toLowerCase())) {
      uniqueSlug = `${rawSlug}-${counter++}`;
    }

    const newStore: Store = {
      id: `store_${Date.now()}`,
      owner_id: user?.id || 'user_merchant_1',
      name: storeData.name || 'My New Store',
      slug: uniqueSlug,
      tagline: storeData.tagline || 'Quality goods curated for you',
      description: storeData.description || 'Welcome to our brand new online store.',
      logo_url: storeData.logo_url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
      banner_url: storeData.banner_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
      primary_color: storeData.primary_color || '#008060',
      accent_color: storeData.accent_color || '#004c3f',
      background_color: storeData.background_color || '#ffffff',
      currency: storeData.currency || 'USD',
      currency_symbol: storeData.currency_symbol || '$',
      contact_email: storeData.contact_email || user?.email || 'contact@store.com',
      contact_phone: storeData.contact_phone || '+1 (555) 000-0000',
      address: storeData.address || '100 Market St, Suite 200',
      status: 'active',
      layout_settings: storeData.layout_settings || {
        hero_title: `Welcome to ${storeData.name || 'Our Store'}`,
        hero_subtitle: 'Discover hand-picked curated collections engineered for everyday living.',
        hero_button_text: 'Shop Collection',
        show_featured_products: true,
        show_announcement: true,
        announcement_text: '🎉 Grand Opening Special: Get 10% off your first order!',
        show_newsletter: true,
        show_reviews: true,
        show_categories: true
      },
      payment_settings: storeData.payment_settings || {
        cod_enabled: true,
        upi_enabled: true,
        upi_id: 'merchant@upi',
        upi_name: storeData.name || 'Store Merchant',
        qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=merchant@upi%26pn=Merchant%26cu=INR'
      },
      created_at: new Date().toISOString()
    };

    setStores(prev => [newStore, ...prev]);
    setActiveStoreId(newStore.id);

    // Also attach a Starter or Growth subscription
    const newSub: Subscription = {
      id: `sub_${Date.now()}`,
      user_id: newStore.owner_id,
      store_id: newStore.id,
      plan_id: 'plan_growth',
      billing_cycle: 'monthly',
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    };
    setSubscriptions(prev => [newSub, ...prev]);

    return newStore;
  };

  const updateStore = (id: string, updates: Partial<Store>) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStore = (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id));
    setProducts(prev => prev.filter(p => p.store_id !== id));
    setOrders(prev => prev.filter(o => o.store_id !== id));
    if (activeStoreId === id) {
      const remaining = stores.filter(s => s.id !== id);
      if (remaining.length > 0) setActiveStoreId(remaining[0].id);
    }
  };

  const toggleStoreStatus = (id: string) => {
    setStores(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'active' ? 'suspended' : 'active' };
      }
      return s;
    }));
  };

  const getStoreProducts = (storeId: string) => {
    return products.filter(p => p.store_id === storeId);
  };

  const canAddProduct = (storeId: string): CanAddProductResult => {
    const storeProducts = products.filter(p => p.store_id === storeId);
    const maxLimit = currentPlan ? currentPlan.product_limit : 10;
    const currentCount = storeProducts.length;

    if (currentCount >= maxLimit) {
      return {
        allowed: false,
        currentCount,
        maxLimit,
        reason: `You have reached the maximum product limit (${maxLimit}) for the ${currentPlan?.name || 'Starter'} plan. Upgrade your plan to add more products.`
      };
    }

    return {
      allowed: true,
      currentCount,
      maxLimit
    };
  };

  const addProduct = (productData: Omit<Product, 'id' | 'created_at'>) => {
    const check = canAddProduct(productData.store_id);
    if (!check.allowed) {
      return { success: false, error: check.reason };
    }

    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      created_at: new Date().toISOString()
    };

    setProducts(prev => [newProduct, ...prev]);
    return { success: true, product: newProduct };
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getStoreOrders = (storeId: string) => {
    return orders.filter(o => o.store_id === storeId);
  };

  const getCustomerOrders = (email: string) => {
    return orders.filter(o => o.customer_email.toLowerCase() === email.toLowerCase());
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'created_at'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      created_at: new Date().toISOString()
    };

    // Decrement stock for ordered items
    setProducts(prev => prev.map(prod => {
      const item = orderData.items.find(i => i.product_id === prod.id);
      if (item) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - item.quantity)
        };
      }
      return prod;
    }));

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updatePaymentStatus = (orderId: string, payment_status: PaymentStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status } : o));
  };

  const upgradeSubscription = (planId: string, billingCycle: 'monthly' | 'yearly') => {
    const targetPlan = plans.find(p => p.id === planId);
    if (!targetPlan) return;

    const days = billingCycle === 'yearly' ? 365 : 30;
    const updatedSub: Subscription = {
      id: currentSubscription ? currentSubscription.id : `sub_${Date.now()}`,
      user_id: user?.id || 'user_merchant_1',
      store_id: activeStore?.id,
      plan_id: planId,
      billing_cycle: billingCycle,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
      created_at: currentSubscription?.created_at || new Date().toISOString()
    };

    setSubscriptions(prev => {
      const exists = prev.some(s => s.id === updatedSub.id);
      if (exists) {
        return prev.map(s => s.id === updatedSub.id ? updatedSub : s);
      }
      return [updatedSub, ...prev];
    });
  };

  const resetToDemoData = () => {
    setStores(INITIAL_STORES);
    setActiveStoreId(INITIAL_STORES[0].id);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setPlans(INITIAL_PLANS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    localStorage.removeItem(STORAGE_KEYS.STORES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.PLANS);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTIONS);
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        activeStore,
        activeStoreId,
        setActiveStoreId,
        getStoreBySlug,
        createStore,
        updateStore,
        deleteStore,
        toggleStoreStatus,

        products,
        getStoreProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        canAddProduct,

        orders,
        getStoreOrders,
        getCustomerOrders,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,

        plans,
        subscriptions,
        currentSubscription,
        currentPlan,
        upgradeSubscription,

        resetToDemoData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
