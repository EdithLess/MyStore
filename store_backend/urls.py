# store_backend/urls.py (тепер ГОЛОВНИЙ urls.py)
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import register, login_view, get_products, CartViewSet, create_checkout_session, import_products_from_api, populate_products

router = DefaultRouter()
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', register),
    path('api/login/', login_view),
    path('api/products/', get_products),
    path('api/', include(router.urls)),
    path('api/import-products/', import_products_from_api),
    path('api/create-checkout-session/', create_checkout_session, name='create-checkout-session'),
    path('populate-products/', populate_products),
]
