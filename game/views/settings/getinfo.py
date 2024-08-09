from django.http import JsonResponse
from game.models.player.player import Player


def getinfo_acapp(request):
    player = Player.objects.all()[0]  # 取出第一个玩家
    return JsonResponse({
        'result': 'success',
        'username': player.user.username,
        'photo': player.photo,
    })


def getinfo_web(request):
    # 检测是否登录
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': '未登录'
        })
    else:
        player = Player.objects.all()[0]  # 取出第一个玩家
        return JsonResponse({
            'result': 'success',
            'username': player.user.username,
            'photo': player.photo,
        })


# 每次调用请求的时候都要加上request
def getinfo(request):
    platform = request.GET.get('platform')  # 从哪个端传入的
    if platform == 'ACAPP':
        return getinfo_acapp(request)
    elif platform == 'WEB':
        return getinfo_web(request)
