from django.urls import path, include
from game.views.views import index


urlpatterns = [
    path('', index, name='index'),
    path('/menu/', include('game.urls.menu.urls')),
    path('/playground/', include('game.urls.playground.urls')),
    path('/settings/', include('game.urls.settings.urls'))
]
