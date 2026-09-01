# -*- coding: utf-8 -*-
"""生成《AI 智能校园二手交易平台》界面原型示意图（AI 版，演示用）
改动：01 首页加 AI 估价标记；02 详情页删校内自提/改线上担保交易 + 加 AI 智能问答；
03 发布页加 AI 建议售价与 AI 自动生成描述；04 个人中心加信用分/减碳；05 后台加 AI 预检。
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '_py_deps'))

from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), u'演示图-AI')
os.makedirs(OUT, exist_ok=True)

FONT_W3 = '/System/Library/Fonts/Hiragino Sans GB.ttc'
FONT_W6 = '/System/Library/Fonts/Hiragino Sans GB.ttc'
FONT_W3_ALT = '/System/Library/Fonts/STHeiti Medium.ttc'

C = dict(
    primary='#409EFF', primary_dark='#337ECC', header='#409EFF',
    sidebar='#304156', sidebar_active='#1F2D3D',
    bg='#F5F7FA', card='#FFFFFF', border='#E4E7ED',
    text='#303133', text2='#606266', muted='#909399',
    price='#F56C6C', success='#67C23A', warning='#E6A23C', danger='#F56C6C',
    img='#E4E7ED', imgtext='#A8ABB2',
)

def F(size, bold=False, alt=False):
    f = FONT_W3_ALT if alt else (FONT_W6 if bold else FONT_W3)
    return ImageFont.truetype(f, size, index=0 if alt else (2 if bold else 0))

def text(d, xy, s, size, fill, bold=False, anchor=None, alt=False):
    d.text(xy, s, font=F(size, bold, alt), fill=fill, anchor=anchor)

def rect(d, box, fill=None, outline=None, width=1, radius=0):
    if radius:
        d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)
    else:
        d.rectangle(box, fill=fill, outline=outline, width=width)

def tlen(d, s, size, bold=False):
    return int(d.textlength(s, font=F(size, bold)))

def img_placeholder(d, box, label=u'商品图', radius=8):
    rect(d, box, fill=C['img'], radius=radius)
    lw = tlen(d, label, 18)
    d.text((box[0] + (box[2] - box[0]) / 2 - lw / 2, box[1] + (box[3] - box[1]) / 2 - 14),
           label, font=F(18), fill=C['imgtext'])

def chip(d, xy, s, size=13, fill='#ECF5FF', fg=C['primary'], pad_x=10, pad_y=5, radius=6):
    w = tlen(d, s, size) + pad_x * 2
    h = size + pad_y * 2
    rect(d, (xy[0], xy[1], xy[0] + w, xy[1] + h), fill=fill, radius=radius)
    d.text((xy[0] + w / 2, xy[1] + h / 2), s, font=F(size), fill=fg, anchor='mm')

def header(d, title=u'AI 校园二手', sub=u'AI 估价 · 校园信用 · 绿色减碳', show_search=True):
    rect(d, (0, 0, W, 64), fill=C['header'])
    rect(d, (24, 14, 56, 46), fill='#FFFFFF', radius=8)
    d.text((40, 30), u'闲', font=F(20, True), fill=C['primary'], anchor='mm')
    d.text((70, 20), title, font=F(24, True), fill='#FFFFFF')
    d.text((70, 46), sub, font=F(12), fill='#D9ECFF')
    if show_search:
        rect(d, (320, 14, 800, 50), fill='#FFFFFF', radius=18)
        d.text((342, 32), u'搜索 书籍 / 数码 / 生活用品…', font=F(15), fill='#A0CFFF')
        rect(d, (744, 14, 800, 50), fill='#FFFFFF', radius=18)
        d.text((772, 32), u'搜索', font=F(15, True), fill=C['primary'], anchor='mm')
    rect(d, (1050, 16, 1146, 48), fill='#FFFFFF', radius=8)
    d.text((1098, 32), u'发布闲置', font=F(15, True), fill=C['primary'], anchor='mm')
    d.ellipse((1172, 16, 1224, 68), fill='#FFD04B')
    d.text((1198, 42), u'陈', font=F(20, True), fill='#7A5B00', anchor='mm')

def slim_bar(d, left, right=None):
    rect(d, (0, 0, W, 56), fill='#FFFFFF')
    rect(d, (0, 54, W, 56), fill=C['border'])
    d.text((24, 28), u'‹  返回', font=F(15), fill=C['text2'], anchor='lm')
    d.text((W / 2, 28), left, font=F(18, True), fill=C['text'], anchor='mm')
    if right:
        d.text((W - 24, 28), right, font=F(14), fill=C['primary'], anchor='rm')

def canvas(H=820):
    im = Image.new('RGB', (W, H), C['bg'])
    return im, ImageDraw.Draw(im)

W = 1280
H = 820

# ---------- 图1：平台首页（商品列表 + AI 估价标记） ----------
def page_home():
    im, d = canvas()
    header(d)
    rect(d, (0, 64, W, 116), fill='#FFFFFF')
    cats = [u'全部', u'书籍教材', u'数码电子', u'生活用品', u'文体运动', u'美妆个护', u'其他']
    x = 40
    for i, c in enumerate(cats):
        if i == 0:
            chip(d, (x, 82), c, size=14, fill=C['primary'], fg='#FFFFFF')
        else:
            d.text((x + 8, 94), c, font=F(15), fill=C['text2'], anchor='lm')
        x += 150
    d.text((40, 132), u'AI 猜你喜欢', font=F(14, True), fill=C['primary'])
    for i, s in enumerate([u'价格 ↑', u'发布时间', u'仅看可小刀']):
        d.text((160 + i * 110, 132), s, font=F(14), fill=C['text2'])
    d.text((W - 60, 132), u'共 128 件', font=F(14), fill=C['muted'], anchor='rm')

    products = [
        (u'高等数学(上) 同济第七版', u'¥15.00', u'王同学 · 东校区', u'AI 估价 ¥32~48'),
        (u'考研英语真题解析(黄皮书)', u'¥20.00', u'李同学 · 西校区', u''),
        (u'小米手环8 标准版', u'¥80.00', u'张同学 · 东校区', u'AI 估价 ¥65~90'),
        (u'LED 护眼台灯', u'¥12.00', u'赵同学 · 南校区', u''),
        (u'斯伯丁篮球 7号', u'¥25.00', u'刘同学 · 北校区', u'AI 估价 ¥20~30'),
        (u'便携小风扇 USB充电', u'¥18.00', u'周同学 · 东校区', u''),
        (u'四六级真题合集(近5年)', u'¥10.00', u'吴同学 · 西校区', u''),
        (u'TP-LINK 千兆路由器', u'¥30.00', u'郑同学 · 南校区', u'AI 估价 ¥25~38'),
    ]
    cw, chh, gap = 285, 300, 20
    x0, y0 = 40, 168
    for i, (name, price, seller, ai) in enumerate(products):
        col, row = i % 4, i // 4
        x = x0 + col * (cw + gap)
        y = y0 + row * (chh + 14)
        rect(d, (x, y, x + cw, y + chh), fill=C['card'], radius=10)
        img_placeholder(d, (x + 6, y + 6, x + cw - 6, y + 172))
        d.text((x + 14, y + 184), name, font=F(15), fill=C['text'])
        d.text((x + 14, y + 216), price, font=F(20, True), fill=C['price'])
        d.text((x + cw - 14, y + 224), u'8成新', font=F(12), fill=C['success'], anchor='rm')
        if ai:
            d.text((x + 14, y + 252), ai, font=F(12), fill=C['success'])
        d.text((x + 14, y + 276), seller, font=F(12), fill=C['muted'])
    d.text((W / 2, 796), u'—— 已经到底啦 ——', font=F(13), fill=C['muted'], anchor='mm')
    im.save(os.path.join(OUT, u'01-平台首页-商品列表.png'))
    print('01 done')

# ---------- 图2：商品详情页（线上担保交易 + AI 智能问答） ----------
def page_detail():
    im, d = canvas()
    slim_bar(d, u'商品详情', right=u'分享')
    d.text((30, 92), u'首页 / 书籍教材 / 高等数学(上) 同济第七版', font=F(13), fill=C['muted'])
    img_placeholder(d, (40, 118, 560, 638), label=u'商品大图', radius=10)
    tx = 40
    for i in range(4):
        rect(d, (tx, 654, tx + 118, 772), fill='#FFFFFF', outline=C['border'], width=1, radius=8)
        img_placeholder(d, (tx + 6, 660, tx + 112, 766), label=u'图', radius=6)
        tx += 134

    x = 610
    d.text((x, 118), u'高等数学(上) 同济第七版 教材', font=F(26, True), fill=C['text'])
    chip(d, (x, 168), u'8成新', size=13, fill='#ECF5FF', fg=C['primary'])
    chip(d, (x + 92, 168), u'有少量笔记', size=13)
    chip(d, (x + 196, 168), u'可小刀', size=13)
    d.text((x, 226), u'¥15.00', font=F(34, True), fill=C['price'])
    d.text((x + 170, 246), u'原价 ¥45.00 · AI 建议 ¥32~48', font=F(14), fill=C['muted'])
    rect(d, (x, 292, 1240, 294), fill=C['border'])
    y = 316
    for label, val in [(u'商品分类', u'书籍教材'), (u'所在校区', u'东校区'),
                       (u'交易方式', u'线上担保交易（确认收货后结算）')]:
        d.text((x, y), label, font=F(15), fill=C['muted'])
        d.text((x + 150, y), val, font=F(15), fill=C['text'])
        y += 42
    rect(d, (x, 452, 1240, 454), fill=C['border'])
    d.text((x, 478), u'商品描述', font=F(16, True), fill=C['text'])
    for i, s in enumerate([
        u'教材为同济第七版上册，封面有轻微磨损，内页干净无涂写，',
        u'交易全程线上完成，交付方式可与卖家私信协商。']):
        d.text((x, 514 + i * 32), s, font=F(15), fill=C['text2'])

    # AI 智能问答面板
    rect(d, (610, 590, 1240, 700), fill='#F0F9EB', outline=C['success'], width=1, radius=10)
    d.text((634, 608), u'AI 智能问答', font=F(15, True), fill=C['success'])
    d.text((634, 636), u'问：书里有笔记吗？', font=F(14), fill=C['text2'])
    d.text((634, 664), u'AI：内页干净无涂写，可放心入手。', font=F(14), fill=C['text'])
    d.text((634, 692), u'问：可以小刀吗？', font=F(14), fill=C['text2'])
    d.text((1180, 664), u'转人工 →', font=F(13), fill=C['primary'], anchor='rm')

    # 卖家卡片
    rect(d, (610, 710, 1240, 772), fill='#FFFFFF', radius=10)
    d.ellipse((626, 718, 674, 766), fill='#409EFF')
    d.text((650, 742), u'王', font=F(18, True), fill='#FFFFFF', anchor='mm')
    d.text((690, 732), u'王同学', font=F(16, True), fill=C['text'])
    d.text((690, 756), u'信用良好 · 12 次交易', font=F(12), fill=C['muted'])
    rect(d, (940, 726, 1030, 758), fill=C['primary'], radius=8)
    d.text((985, 742), u'私信卖家', font=F(15, True), fill='#FFFFFF', anchor='mm')
    rect(d, (1045, 726, 1120, 758), fill='#FFFFFF', outline=C['primary'], radius=8)
    d.text((1082, 742), u'收藏', font=F(15), fill=C['primary'], anchor='mm')
    d.text((1160, 742), u'举报', font=F(13), fill=C['muted'], anchor='mm')
    im.save(os.path.join(OUT, u'02-商品详情页.png'))
    print('02 done')

# ---------- 图3：AI 智能发布表单（AI 估价 + AI 生成描述） ----------
def page_publish():
    im, d = canvas(H=900)
    slim_bar(d, u'AI 智能发布闲置')
    rect(d, (200, 84, 1080, 880), fill='#FFFFFF', radius=10)

    # 商品标题
    d.text((240, 136), u'商品标题', font=F(16, True), fill=C['text'])
    rect(d, (390, 120, 1040, 172), fill='#FFFFFF', outline=C['border'], width=1, radius=6)
    d.text((410, 146), u'请输入商品名称（如：高等数学(上) 同济第七版）', font=F(15), fill='#C0C4CC')

    # 价格
    d.text((240, 220), u'价格', font=F(16, True), fill=C['text'])
    rect(d, (390, 204, 1040, 256), fill='#FFFFFF', outline=C['border'], width=1, radius=6)
    d.text((410, 230), u'¥ 请输入出售价格（元）', font=F(15), fill='#C0C4CC')

    # AI 建议售价
    rect(d, (390, 276, 1040, 340), fill='#ECF5FF', radius=8)
    d.text((410, 292), u'AI 建议售价 ¥35 ~ ¥55', font=F(15, True), fill=C['primary'])
    d.text((410, 320), u'参考：同款教材近 30 天成交价 ¥30~60（九成新）', font=F(13), fill=C['muted'])
    d.text((1020, 308), u'重新估价', font=F(13), fill=C['primary'], anchor='rm')

    # 分类
    d.text((240, 368), u'分类', font=F(16, True), fill=C['text'])
    rect(d, (390, 352, 620, 404), fill='#FFFFFF', outline=C['border'], width=1, radius=6)
    d.text((410, 378), u'书籍教材  ▾', font=F(15), fill=C['text2'])
    d.text((640, 378), u'已由 AI 识别，可手动修改', font=F(13), fill=C['success'], anchor='lm')

    # 成色
    d.text((240, 452), u'成色', font=F(16, True), fill=C['text'])
    for i, s in enumerate([u'全新', u'9成新', u'8成新', u'7成新', u'7成新以下']):
        chip(d, (390 + i * 128, 508), s, size=14, fill='#ECF5FF', fg=C['primary'] if i == 2 else C['text2'])

    # 商品描述 + AI 生成按钮
    d.text((240, 596), u'商品描述', font=F(16, True), fill=C['text'])
    rect(d, (880, 580, 1040, 612), fill=C['primary'], radius=6)
    d.text((960, 596), u'AI 自动生成', font=F(13, True), fill='#FFFFFF', anchor='mm')
    rect(d, (390, 580, 1040, 710), fill='#FFFFFF', outline=C['border'], width=1, radius=6)
    d.text((410, 608), u'点击"AI 自动生成"，将根据图片与成色生成描述草稿', font=F(14), fill='#C0C4CC')

    # 商品图片
    d.text((240, 738), u'商品图片', font=F(16, True), fill=C['text'])
    for i in range(6):
        bx = 390 + i * 108
        rect(d, (bx, 722, bx + 96, 818), fill='#F8F9FB', outline=C['border'], width=1, radius=8)
        d.text((bx + 48, 770), u'+', font=F(30), fill='#A8ABB2', anchor='mm')
    d.text((390, 834), u'上传图片后 AI 自动识别分类、成色并生成描述（最多 6 张，支持 JPG / PNG）', font=F(13), fill=C['muted'])

    # 操作按钮
    rect(d, (740, 828, 860, 880), fill='#FFFFFF', outline=C['border'], radius=8)
    d.text((800, 854), u'存草稿', font=F(16), fill=C['text2'], anchor='mm')
    rect(d, (880, 828, 1040, 880), fill=C['primary'], radius=8)
    d.text((960, 854), u'提交发布', font=F(17, True), fill='#FFFFFF', anchor='mm')
    im.save(os.path.join(OUT, u'03-商品发布表单.png'))
    print('03 done')

# ---------- 图4：个人中心（信用分 / 减碳） ----------
def page_profile():
    im, d = canvas()
    rect(d, (0, 0, W, 56), fill='#FFFFFF')
    rect(d, (0, 54, W, 56), fill=C['border'])
    d.text((24, 28), u'‹  返回首页', font=F(15), fill=C['text2'], anchor='lm')
    d.text((W / 2, 28), u'个人中心', font=F(18, True), fill=C['text'], anchor='mm')
    rect(d, (0, 56, 220, H), fill='#FFFFFF')
    rect(d, (0, 56, 4, H), fill=C['border'])
    d.ellipse((70, 96, 150, 176), fill='#FFD04B')
    d.text((110, 136), u'陈', font=F(28, True), fill='#7A5B00', anchor='mm')
    d.text((110, 192), u'陈同学', font=F(17, True), fill=C['text'], anchor='mm')
    d.text((110, 222), u'学号 2024xxxxx', font=F(12), fill=C['muted'], anchor='mm')
    d.text((110, 248), u'信用分 86 · 环保积分 320', font=F(12, True), fill=C['success'], anchor='mm')
    menu = [u'我的发布', u'我的收藏', u'我的订单', u'个人信息', u'账号与安全', u'退出登录']
    for i, m in enumerate(menu):
        yy = 290 + i * 52
        if i == 0:
            rect(d, (8, yy, 212, yy + 44), fill='#ECF5FF', radius=8)
            d.text((28, yy + 22), m, font=F(15, True), fill=C['primary'], anchor='lm')
        else:
            d.text((28, yy + 22), m, font=F(15), fill=C['text2'], anchor='lm')

    x = 250
    d.text((x, 84), u'我发布的商品', font=F(18, True), fill=C['text'])
    d.text((x + 150, 92), u'共 3 件', font=F(13), fill=C['muted'])
    d.text((x + 520, 92), u'累计减碳 12.4kg · 相当于植树 2 棵', font=F(13, True), fill=C['success'])
    items = [
        (u'高等数学(上) 同济第七版', u'¥15.00', u'在售', u'2026-08-30 20:14', True),
        (u'考研英语真题解析(黄皮书)', u'¥20.00', u'在售', u'2026-08-28 09:02', True),
        (u'旧版大学物理教材', u'¥8.00', u'已下架', u'2026-08-20 15:47', False),
    ]
    y = 120
    for name, price, status, tm, onsale in items:
        rect(d, (x, y, 1230, y + 130), fill='#FFFFFF', radius=10)
        img_placeholder(d, (x + 16, y + 16, x + 112, y + 112), label=u'图', radius=6)
        d.text((x + 132, y + 26), name, font=F(16), fill=C['text'])
        d.text((x + 132, y + 70), price, font=F(18, True), fill=C['price'])
        d.text((x + 240, y + 76), u'发布时间 ' + tm, font=F(12), fill=C['muted'])
        chip(d, (x + 520, y + 26), status, size=12,
             fill='#F0F9EB' if onsale else '#F4F4F5', fg=C['success'] if onsale else C['muted'])
        rect(d, (1030, y + 84, 1100, y + 116), fill='#FFFFFF', outline=C['border'], radius=6)
        d.text((1065, y + 100), u'编辑', font=F(13), fill=C['text2'], anchor='mm')
        rect(d, (1110, y + 84, 1180, y + 116), fill='#FFFFFF', outline=C['border'], radius=6)
        d.text((1145, y + 100), u'下架', font=F(13), fill=C['text2'], anchor='mm')
        d.text((1186, y + 100), u'···', font=F(16, True), fill=C['muted'], anchor='mm')
        y += 146
    im.save(os.path.join(OUT, u'04-个人中心-我的发布.png'))
    print('04 done')

# ---------- 图5：管理后台（AI 辅助审核） ----------
def page_admin():
    im, d = canvas()
    rect(d, (0, 0, 200, H), fill=C['sidebar'])
    rect(d, (0, 0, 200, 64), fill='#263445')
    d.rounded_rectangle((16, 14, 48, 46), radius=8, fill='#FFFFFF')
    d.text((32, 30), u'闲', font=F(16, True), fill=C['primary'], anchor='mm')
    d.text((58, 30), u'AI 校园二手 · 管理端', font=F(16, True), fill='#FFFFFF', anchor='lm')
    menu = [(u'数据统计', True), (u'商品审核', False), (u'用户管理', False),
            (u'分类管理', False), (u'系统设置', False)]
    for i, (m, active) in enumerate(menu):
        yy = 88 + i * 52
        if active:
            rect(d, (8, yy, 192, yy + 44), fill=C['primary'], radius=8)
            d.text((28, yy + 22), m, font=F(15, True), fill='#FFFFFF', anchor='lm')
        else:
            d.text((28, yy + 22), m, font=F(15), fill='#BFCFE0', anchor='lm')
    d.text((28, 640), u'管理员：林老师', font=F(13), fill='#8FA3BC')
    d.text((28, 668), u'v1.0.0', font=F(11), fill='#6B7F98')

    rect(d, (200, 0, W, 56), fill='#FFFFFF')
    rect(d, (200, 54, W, 56), fill=C['border'])
    d.text((228, 28), u'管理后台', font=F(17, True), fill=C['text'], anchor='lm')
    rect(d, (880, 12, 1160, 44), fill='#F5F7FA', radius=16)
    d.text((900, 28), u'搜索商品 / 用户', font=F(14), fill='#A8ABB2', anchor='lm')
    d.ellipse((1192, 12, 1244, 64), fill='#409EFF')
    d.text((1218, 38), u'林', font=F(18, True), fill='#FFFFFF', anchor='mm')

    stats = [(u'用户总量', u'1,286', u'+12 本周'), (u'商品总量', u'3,542', u'+86 本周'),
             (u'待审核商品', u'27', u'AI 预检拦截 6 件'), (u'今日交易', u'86', u'较昨日 +14')]
    x = 228
    for title, num, sub in stats:
        rect(d, (x, 76, x + 244, 168), fill='#FFFFFF', radius=10)
        d.text((x + 16, 94), title, font=F(14), fill=C['muted'])
        d.text((x + 16, 118), num, font=F(26, True), fill=C['text'])
        d.text((x + 16, 152), sub, font=F(12), fill=C['success'] if u'拦截' in sub else C['primary'])
        x += 262

    rect(d, (228, 190, 966, 400), fill='#FFFFFF', radius=10)
    d.text((248, 210), u'近 7 日商品发布与交易量', font=F(16, True), fill=C['text'])
    days = [u'周一', u'周二', u'周三', u'周四', u'周五', u'周六', u'周日']
    pub = [24, 32, 28, 41, 36, 55, 48]
    trd = [15, 21, 18, 30, 26, 40, 33]
    bw, gap, base_y = 26, 34, 356
    x0 = 268
    for i in range(7):
        bx = x0 + i * (bw * 2 + gap + 16)
        h1 = int(pub[i] / 55 * 120)
        h2 = int(trd[i] / 55 * 120)
        rect(d, (bx, base_y - h1, bx + bw, base_y), fill=C['primary'], radius=3)
        d.text((bx + bw / 2, base_y - h1 - 14), str(pub[i]), font=F(11), fill=C['primary'], anchor='mm')
        rect(d, (bx + bw + 8, base_y - h2, bx + bw * 2 + 8, base_y), fill=C['success'], radius=3)
        d.text((bx + bw * 1.5 + 8, base_y - h2 - 14), str(trd[i]), font=F(11), fill=C['success'], anchor='mm')
        d.text((bx + bw + 4, base_y + 12), days[i], font=F(12), fill=C['muted'], anchor='mm')
    rect(d, (x0, 392, x0 + 26, 402), fill=C['primary'], radius=2)
    d.text((x0 + 36, 397), u'发布量', font=F(12), fill=C['text2'], anchor='lm')
    rect(d, (x0 + 100, 392, x0 + 126, 402), fill=C['success'], radius=2)
    d.text((x0 + 136, 397), u'交易量', font=F(12), fill=C['text2'], anchor='lm')
    rect(d, (972, 210, 1240, 400), fill='#FFFFFF', radius=10)
    d.text((992, 228), u'待审核商品 TOP', font=F(15, True), fill=C['text'])
    for i, (n, c) in enumerate([(u'数码相机 佳能600D', u'数码电子'), (u'考研数学讲义全套', u'书籍教材'),
                                (u'自行车 山地车', u'生活用品'), (u'篮球鞋 42码', u'文体运动')]):
        yy = 268 + i * 40
        d.text((992, yy), u'· ' + n, font=F(13), fill=C['text2'])
        d.text((1160, yy), c, font=F(12), fill=C['muted'], anchor='rm')

    rect(d, (228, 420, 1240, 688), fill='#FFFFFF', radius=10)
    d.text((248, 438), u'待审核商品列表（AI 预检 + 人工复核）', font=F(15, True), fill=C['text'])
    colx = [248, 560, 760, 900, 1080]
    heads = [u'商品名称', u'发布人', u'分类', u'AI 预检', u'操作']
    for hx, h in zip(colx, heads):
        d.text((hx, 472), h, font=F(13, True), fill=C['muted'])
    rows = [
        (u'九成新山地自行车', u'李同学', u'生活用品', u'通过', C['success']),
        (u'高数同济第七版', u'王同学', u'书籍教材', u'通过', C['success']),
        (u'索尼 WH-1000XM4', u'张同学', u'数码电子', u'疑似违规', C['warning']),
    ]
    for i, (n, u_, c, ai, aicolor) in enumerate(rows):
        yy = 500 + i * 46
        rect(d, (248, yy, 1240, yy + 40), fill='#FAFAFA' if i % 2 else '#FFFFFF')
        d.text((248, yy + 20), n, font=F(14), fill=C['text'], anchor='lm')
        d.text((560, yy + 20), u_, font=F(14), fill=C['text2'], anchor='lm')
        d.text((760, yy + 20), c, font=F(14), fill=C['text2'], anchor='lm')
        d.text((900, yy + 20), u'AI 预检 ' + ai, font=F(13, True), fill=aicolor, anchor='lm')
        rect(d, (1080, yy + 6, 1140, yy + 34), fill=C['success'], radius=6)
        d.text((1110, yy + 20), u'通过', font=F(13, True), fill='#FFFFFF', anchor='mm')
        rect(d, (1150, yy + 6, 1210, yy + 34), fill=C['danger'], radius=6)
        d.text((1180, yy + 20), u'驳回', font=F(13, True), fill='#FFFFFF', anchor='mm')
    im.save(os.path.join(OUT, u'05-管理后台-数据统计.png'))
    print('05 done')

page_home()
page_detail()
page_publish()
page_profile()
page_admin()
print('all done ->', OUT)
