"""Banco determinístico: respostas calculadas, 5 famílias e dificuldade progressiva."""
import random

def build_bank():
    bank=[]
    def add(cat,q,answer,others,hint,solution,level=1,**extra):
        options=list(dict.fromkeys(map(str,[answer,*others])))
        assert len(options)==4, q
        random.Random(q).shuffle(options)
        bank.append(dict(id=len(bank)+1,cat=cat,q=q,ans=options,key=options.index(str(answer)),hint=hint,solution=solution,level=level,**extra))
    for n in range(1,31):
        a=n+4;b=n%7+2;c=n%5+2;kind=n%5
        if kind==0:
            v=a+b*c;q=f'{a} + {b} × {c} = ?';h='Multiplique antes de somar.';sol=f'{b} × {c} = {b*c}; depois some {a}: {v}.'
        elif kind==1:
            v=a*(b+c);q=f'{a} × ({b} + {c}) = ?';h='Resolva primeiro os parênteses.';sol=f'{b} + {c} = {b+c}; multiplique por {a}: {v}.'
        elif kind==2:
            percent=[10,20,25,50][n%4];base=(n+4)*20;v=base*percent//100;q=f'Quanto é {percent}% de {base}?';h='Divida por 100 e multiplique pela porcentagem.';sol=f'{base} × {percent} ÷ 100 = {v}.'
        elif kind==3:
            v=a-c;q=f'{a*b} ÷ {b} − {c} = ?';h='Faça primeiro a divisão.';sol=f'{a*b} ÷ {b} = {a}; subtraia {c}: {v}.'
        else:
            v=a*a-b;q=f'{a}² − {b} = ?';h='Eleve ao quadrado antes de subtrair.';sol=f'{a} × {a} = {a*a}; menos {b}: {v}.'
        add('MATEMÁTICA',q,v,[v+1,v-2,v+7],h,sol,1+n//11)
    for n in range(1,31):
        step=n%9+2;a=n+1;kind=n%5
        if kind==0:
            values=[a+i*step for i in range(5)];h='A diferença entre termos é constante.';sol=f'Some {step} ao último termo: {values[-1]}.'
        elif kind==1:
            values=[a*2**i for i in range(5)];h='Cada termo é o dobro do anterior.';sol=f'{values[-2]} × 2 = {values[-1]}.'
        elif kind==2:
            values=[(a+i)**2 for i in range(5)];h='São quadrados de inteiros consecutivos.';sol=f'O próximo quadrado é {a+4}² = {values[-1]}.'
        elif kind==3:
            values=[a+i*(i+1)//2 for i in range(5)];h='Some 1, depois 2, depois 3…';sol=f'O próximo aumento é 4: {values[-2]} + 4 = {values[-1]}.'
        else:
            values=[a*3**i for i in range(5)];h='Cada termo é o triplo do anterior.';sol=f'{values[-2]} × 3 = {values[-1]}.'
        v=values[-1];add('PADRÕES',', '.join(map(str,values[:-1]))+', ?',v,[v+1,v-1,v+7],h,sol,1+n//11)
    for n in range(1,26):
        a=n+2;b=n%5+2;kind=n%5
        if kind==0:
            v=a*b;add('LÓGICA',f'{b} caixas com {a} fichas cada. Quantas fichas?',v,[v+1,v-1,v+b],'Todos os grupos têm o mesmo tamanho.',f'{b} × {a} = {v} fichas.',1+n//9)
        elif kind==1:
            days=14+n*3;v=days//7;add('LÓGICA',f'Quantas semanas completas cabem em {days} dias?',v,[v+1,v-1,v+2],'Cada semana tem sete dias.',f'{days} ÷ 7: são {v} semanas completas e {days%7} dias.',1+n//9)
        elif kind==2:
            v=a+b;add('LÓGICA',f'Ana tem {a} anos. Bia é {b} anos mais velha. Idade de Bia?',v,[v-1,v+1,v+3],'Mais velha significa somar a diferença.',f'{a} + {b} = {v} anos.',1+n//9)
        elif kind==3:
            hour=8+n%4;minutes=n*5+20;total=hour*60+minutes
            fmt=lambda t:f'{(t//60)%24:02d}:{t%60:02d}'
            add('LÓGICA',f'São {hour}:00. Que horas serão após {minutes} minutos?',fmt(total),[fmt(total-30),fmt(total+30),fmt(total+60)],'Uma hora tem 60 minutos.',f'Some {minutes} minutos a {hour}:00: {fmt(total)}.',1+n//9)
        else:
            add('LÓGICA',f'Todos os cartões da caixa são azuis. O cartão {n} está nela. Qual sua cor?','Azul',['Verde','Vermelha','Amarela'],'A regra vale para todos os cartões da caixa.','Se todos são azuis, esse cartão também é azul.',1+n//9)
    for n in range(1,26):
        seq=str(1000+n*137);swap=seq[1:]+seq[0]
        others=[str(int(seq)+1),str(int(seq)+2),str(int(seq)+3)]
        add('MEMÓRIA','Qual era a sequência?',seq,others,'Recorde os dígitos da esquerda para a direita.',f'A sequência exibida foi {seq}.',1+n//9,memory=True,sequence=seq)
    facts=[('Qual planeta é conhecido como planeta vermelho?','Marte',['Vênus','Júpiter','Netuno'],'A cor vem de óxidos de ferro.','Marte tem óxidos de ferro na superfície.'),('Quantos lados tem um hexágono?','6',['5','7','8'],'O prefixo hexa indica a quantidade.','Hexa significa seis.'),('Qual é a capital do Brasil?','Brasília',['Rio de Janeiro','São Paulo','Salvador'],'Foi inaugurada em 1960.','Brasília é a capital federal desde 1960.'),('Qual órgão bombeia o sangue?','Coração',['Pulmão','Fígado','Rim'],'É um músculo que pulsa.','O coração bombeia sangue pela circulação.'),('Qual é o maior oceano?','Pacífico',['Atlântico','Índico','Ártico'],'Ban ha as costas da Ásia e das Américas.','O Pacífico tem a maior área.'),('Quantos minutos há em 2 horas?','120',['60','90','180'],'Uma hora tem 60 minutos.','2 × 60 = 120 minutos.'),('Qual é a fórmula da água?','H₂O',['CO₂','O₂','NaCl'],'Tem hidrogênio e oxigênio.','Cada molécula tem dois átomos de hidrogênio e um de oxigênio.'),('Qual animal é um mamífero?','Golfinho',['Tubarão','Sardinha','Polvo'],'Respira ar e amamenta seus filhotes.','Golfinhos são mamíferos marinhos.'),('Qual instrumento mede temperatura?','Termômetro',['Barômetro','Régua','Balança'],'O nome começa com termo.','Termômetros medem temperatura.'),('Quantos graus tem um ângulo reto?','90°',['45°','180°','360°'],'É o canto de um quadrado.','O ângulo reto mede 90 graus.'),('Qual é o satélite natural da Terra?','Lua',['Sol','Marte','Vênus'],'É visível no céu noturno.','A Lua é o satélite natural da Terra.'),('Quantos dias tem uma semana?','7',['5','6','8'],'Conte de segunda a domingo.','Segunda a domingo são sete dias.')]
    for q,a,o,h,s in facts:add('CURIOSIDADES',q,a,o,h.replace('Ban ha','Banha'),s)
    # Intercala categorias dentro de cada nível sem repetição no ciclo.
    rng=random.Random(42);rng.shuffle(bank);bank.sort(key=lambda q:q['level'])
    return bank
BANK=build_bank()
