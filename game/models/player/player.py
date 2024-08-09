from django.db import models
from django.contrib.auth.models import User


class Player(models.Model):
    # 从user中扩充：一一对应
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # user删除时将其关联的player一起删掉

    photo = models.URLField(max_length=1000, blank=True)

    # 后台显示的名字
    def __str__(self):
        return str(self.user)
