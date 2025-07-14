from django.contrib.auth.models import User
import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from .models import Product, OrderItem, Order, Category
from .serializers import ProductSerializer
from rest_framework import viewsets
from .serializers import OrderSerializer
from rest_framework.decorators import action, permission_classes
import requests
import os

stripe.api_key = settings.STRIPE_SECRET_KEY



@api_view(['POST'])
def populate_products(request):
    try:
        Product.objects.all().delete()
        products = request.data
        for item in products:
            Product.objects.create(
                name=item["name"],
                price=item["price"],
                image=item["image"],
                description=item["description"],
                category_id=item["category"],
            )
        return Response({"message": "✅ Products added from frontend"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        return JsonResponse({'message': 'User created successfully'}, status=201)

    return JsonResponse({'error': 'Invalid method'}, status=405)

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def import_products_from_api(request):
    try:
        response = requests.get("https://api.escuelajs.co/api/v1/products")
        products = response.json()

        for p in products:
            category_data = p.get("category")
            if not category_data:
                continue

            category, _ = Category.objects.get_or_create(name=category_data["name"])

            Product.objects.create(
                name=p["title"],
                description=p["description"],
                price=p["price"],
                image=p["images"][0] if p["images"] else "",
                category=category
            )

        return Response({"message": "Продукти успішно імпортовано"}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        order = Order.objects.filter(user=request.user, is_active=True).prefetch_related("items__product").first()
        if not order:
            return Response({"items": []})
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def create(self, request):
        user = request.user
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"error": "Product ID is required"}, status=400)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        # Створити або знайти активне замовлення
        order, created = Order.objects.get_or_create(user=user, is_active=True)

        # Знайти чи існує вже такий товар у корзині
        item, item_created = OrderItem.objects.get_or_create(order=order, product=product)

        if not item_created:
            item.quantity += 1
            item.save()

        return Response({"message": "Product added to cart"}, status=status.HTTP_201_CREATED)
    
    
    @action(detail=False, methods=["delete"], url_path="remove")
    def remove_from_cart(self, request):
        user = request.user
        product_id = request.data.get("product_id")

        if not product_id:
            return Response({"error": "Product ID is required"}, status=400)

        try:
            order = Order.objects.get(user=user, is_active=True)
        except Order.DoesNotExist:
            return Response({"error": "Active order not found"}, status=404)

        try:
            item = OrderItem.objects.get(order=order, product__id=product_id)
            item.delete()
            return Response({"message": "Product removed from cart"}, status=status.HTTP_204_NO_CONTENT)
        except OrderItem.DoesNotExist:
            return Response({"error": "Product not found in cart"}, status=404)
        
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    user = request.user

    try:
        order = Order.objects.get(user=user, is_paid=False)
        order_items = OrderItem.objects.filter(order=order)

        # Розрахунок загальної суми
        total_amount = 0
        line_items = []

        for item in order_items:
            product = item.product
            quantity = item.quantity
            price = int(product.price * 100)
            total_amount += price * quantity

            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': product.name,
                    },
                    'unit_amount': price,
                },
                'quantity': quantity,
            })

        if total_amount == 0:
            return Response({'error': 'Cart is empty'}, status=400)

        # Stripe сесія
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url='http://localhost:5173/success',
            cancel_url='http://localhost:5173/cancel',
        )

        return Response({'url': session.url})

    except Order.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

