'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    var lang='en',userName='',gender='male',novenaStart=null,currentDay=0,speaking=false,paused=false,currentAudio=null,currentRosKey='glorious';

    // Load saved state
    function loadSaved(){
      try{
        var saved=JSON.parse(localStorage.getItem('novena-state')||'{}');
        if(saved.userName)userName=saved.userName;
        if(saved.gender)gender=saved.gender;
        if(saved.lang)lang=saved.lang;
        if(saved.novenaStart){
          novenaStart=new Date(saved.novenaStart);
          var today=new Date();today.setHours(0,0,0,0);
          var diff=Math.floor((today-novenaStart)/(1000*60*60*24));
          if(diff>=0&&diff<=8){currentDay=diff;}
          else if(diff>8){currentDay=8;}
          else{currentDay=0;}
        }
      }catch(e){}
    }

    function saveState(){
      try{
        localStorage.setItem('novena-state',JSON.stringify({
          userName:userName,gender:gender,lang:lang,
          novenaStart:novenaStart?novenaStart.toISOString():null
        }));
      }catch(e){}
    }

    var nameInput=document.getElementById('nameInput');
    var startDateInput=document.getElementById('startDateInput');
    nameInput.addEventListener('input',function(){updateHeader(this.value.trim());});

    function updateHeader(n){
      if(lang==='en'){
        document.getElementById('mainTitle').textContent=n?'Novena for '+n:'Novena for the Dead';
        document.getElementById('sub').textContent=n?'Nine days of prayer for the repose of the soul of '+n:'Nine days of prayer';
      } else {
        document.getElementById('mainTitle').textContent=n?'Novena por '+n:'Novena por los Difuntos';
        document.getElementById('sub').textContent=n?'Nueve días de oración por el alma de '+n:'Nueve días de oración';
      }
    }

    function setLang(l){
      lang=l;
      document.getElementById('btnEn').style.cssText='padding:8px 22px;border-radius:8px;cursor:pointer;font-family:Georgia,serif;font-size:14px;background:transparent;color:inherit;border:'+(l==='en'?'2px solid currentColor;font-weight:500':'1px solid rgba(128,128,128,0.5)');
      document.getElementById('btnEs').style.cssText='padding:8px 22px;border-radius:8px;cursor:pointer;font-family:Georgia,serif;font-size:14px;background:transparent;color:inherit;border:'+(l==='es'?'2px solid currentColor;font-weight:500':'1px solid rgba(128,128,128,0.5)');
      document.getElementById('lbl-for').textContent=l==='en'?'This novena is offered for':'Esta novena es ofrecida por';
      document.getElementById('lbl-startdate').textContent=l==='en'?'Start date':'Fecha de inicio';
      document.getElementById('beginBtn').textContent=l==='en'?'Begin the Novena ✝':'Comenzar la Novena ✝';
      document.getElementById('gender-section').style.display=l==='es'?'block':'none';
      updateHeader(nameInput.value.trim());
    }

    function setGender(g){
      gender=g;
      document.getElementById('btnMale').style.cssText='padding:6px 18px;border-radius:8px;cursor:pointer;font-family:Georgia,serif;font-size:13px;background:transparent;color:inherit;border:'+(g==='male'?'2px solid currentColor':'1px solid rgba(128,128,128,0.5)');
      document.getElementById('btnFemale').style.cssText='padding:6px 18px;border-radius:8px;cursor:pointer;font-family:Georgia,serif;font-size:13px;background:transparent;color:inherit;border:'+(g==='female'?'2px solid currentColor':'1px solid rgba(128,128,128,0.5)');
    }

    function addDays(d,n){var r=new Date(d);r.setDate(r.getDate()+n);return r;}
    function fmtDate(d){
      var DS=lang==='en'?['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']:['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      var MS=lang==='en'?['January','February','March','April','May','June','July','August','September','October','November','December']:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      return DS[d.getDay()]+', '+d.getDate()+' '+MS[d.getMonth()]+' '+d.getFullYear();
    }

    // Set default start date to today
    var todayStr=new Date().toISOString().split('T')[0];
    startDateInput.value=todayStr;

    function beginNovena(){
      var n=nameInput.value.trim();
      if(!n){document.getElementById('errMsg').style.display='block';return;}
      document.getElementById('errMsg').style.display='none';
      userName=n;
      var sd=startDateInput.value;
      novenaStart=sd?new Date(sd+'T00:00:00'):new Date();
      novenaStart.setHours(0,0,0,0);
      var today=new Date();today.setHours(0,0,0,0);
      var diff=Math.floor((today-novenaStart)/(1000*60*60*24));
      if(diff<0){currentDay=0;}
      else if(diff>8){currentDay=8;}
      else{currentDay=diff;}
      saveState();
      document.getElementById('form-section').style.display='none';
      document.getElementById('novena-section').style.display='block';
      buildCal();showDay(currentDay);
    }

    function resetNovena(){
      try{localStorage.removeItem('novena-state');}catch(e){}
      userName='';novenaStart=null;currentDay=0;gender='male';
      nameInput.value='';
      startDateInput.value=todayStr;
      setLang(lang);
      document.getElementById('novena-section').style.display='none';
      document.getElementById('form-section').style.display='block';
    }

    var ES={
      sign:'Por la señal de la santa Cruz, de nuestros enemigos, líbranos, Señor, Dios nuestro. En el nombre del Padre y del Hijo y del Espíritu Santo. Amén.',
      yoPecador:'Yo confieso ante Dios Todopoderoso, y ante ustedes hermanos que he pecado mucho de pensamiento, palabra, obra y omisión. Por mi culpa, por mi culpa, por mi gran culpa. Por eso ruego a Santa María siempre Virgen, a los ángeles, a los santos y a ustedes hermanos, que intercedan por mí ante Dios, Nuestro Señor. Amén.',
      gloria:'Gloria al Padre y al Hijo y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',
      OF:'Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu Reino; hágase tu voluntad así en la tierra como en el cielo. Danos hoy nuestro pan de cada día; y perdona nuestras ofensas, como nosotros también perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.',
      HM:'Dios te salve, María, llena eres de gracia, el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.',
      jacFunc:function(n,g){
        var lo=g==='female'?'la':'lo';
        var el=g==='female'?'ella':'él';
        return ['Si por Tu sangre preciosa, Señor, '+lo+' has redimido, que '+lo+' perdones, te pido, por Tu Pasión dolorosa.',
          'Dale Señor el descanso eterno, y luzca para '+el+' la luz perpetua.',
          'Que por Tu infinita misericordia el alma de '+n+' y de todos los fieles difuntos, descansen en paz. Así sea.'];
      },
      oracionFinalFunc:function(n,g){
        var herm=g==='female'?'nuestra hermana':'nuestro hermano';
        return 'Señor Nuestro Señor Jesucristo, que muriendo en la cruz y resucitando al tercer día nos redimiste, perdonando los pecados del mundo, destruyendo el poder del mal y de la muerte te pedimos que Tu Santa Redención alcance a '+n+' y que goce contigo en el cielo de la Vida Eterna. Amén. Santa María de Guadalupe, Madre de Dios te pedimos que intercedas por '+herm+' '+n+' por quién rezamos este Novenario, para que su alma pueda llegar al cielo, después de purificarse y gozar de la eterna gloria. Amén.';
      },
      oracionesFinales:'Dios te salve, María Santísima, Hija de Dios Padre, Virgen Purísima antes del parto, en tus manos ponemos nuestra fe para que la ilumines. Llena eres de gracia, el Señor está contigo. Bendita tú eres entre todas las mujeres y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén. Dios te salve, María Santísima, Madre de Dios Hijo, Virgen Purísima en el parto, en tus manos ponemos nuestra esperanza para que la alientes. Llena eres de gracia, el Señor está contigo. Bendita tú eres entre todas las mujeres y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén. Dios te salve, María Santísima, esposa de Dios Espíritu Santo, Virgen Purísima después del parto, en tus manos ponemos nuestra caridad para que la inflames. Llena eres de gracia, el Señor está contigo. Bendita tú eres entre todas las mujeres y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén. Dios te salve, María Santísima, Templo y Sagrario de la Santísima Trinidad, Virgen concebida sin la culpa original. Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh, clemente, oh piadosa, oh dulce Virgen María! Ruega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén.',
      intentiones:[
        function(n,g){var nro=g==='female'?'nuestra':'nuestro';return 'Señor mío me presento ante ti con el fin de rogarte para que nos ayudes a alcanzar el descanso eterno a '+nro+' prójimo '+n+' que ha terminado su vida en este mundo y goza ya de tu presencia en el cielo que con la intercesión de nuestra Madre Santísima de Guadalupe lo acompañe ante tu presencia. Te lo pedimos en el primer día del Novenario que estamos celebrando.';},
        function(n,g){var herm=g==='female'?'hermana':'hermano';return 'Oh Señor Nuestro Jesucristo, sabemos que eres misericordioso y justo con nosotros y por esa razón nos reunimos en este novenario para pedir por nuestro(a) '+herm+' '+n+' que ha partido de este mundo, imploramos misericordia para su alma y que sea liberada de sus culpas cometidas y alcance la paz eterna. Te lo pedimos en el segundo día del Novenario que estamos celebrando.';},
        function(n,g){var herm=g==='female'?'hermana':'hermano';return 'Señor mío Jesucristo entendemos que tu justicia es grande, te rogamos por el alma de nuestro(a) '+herm+' '+n+' que ha salido de este mundo, para que le concedas el perdón de sus pecados y faltas cometidas, pues quizás por falta de tiempo o de voluntad no se arrepintió de sus errores cometidos en la tierra, para que le ayudes a alcanzar tu paz eterna, te lo pedimos en el tercer día del Novenario que estamos celebrando.';},
        function(n,g){return 'Oh Señor mío, te pedimos que auxilies el alma de '+n+' para que enmendando sus fallas y purificándose pueda alcanzar la gloria eterna y gozar de la plenitud de la vida eterna, te lo pedimos en el cuarto día del Novenario que estamos celebrando.';},
        function(n,g){return 'Señor mío Jesucristo te adoramos y alabamos agradeciéndote por tener misericordia del alma de '+n+' quien tal vez no fue fiel al Evangelio en este mundo, pero sabemos que en tu infinita bondad siempre buscas el arrepentimiento del pecador, te lo pedimos en el quinto día del Novenario que estamos celebrando.';},
        function(n,g){return 'Señor mío Jesucristo, tu que nos mandas a honrar a nuestros padres en uno de tus mandamientos para que todo nos salga bien y se alargan nuestros días en la tierra nos presentamos ante tu misericordia el alma de '+n+' para que le brindes tu luz y alcance plenamente la salvación, te lo pedimos en el sexto día del Novenario que estamos celebrando.';},
        function(n,g){return 'Señor mío Jesucristo, rogamos por el alma de '+n+' para que le concedas un lugar en tu gloria después de purificar sus culpas y alcanzar la plenitud de la salvación, te lo pedimos en el séptimo día del Novenario que estamos celebrando.';},
        function(n,g){return 'Señor mío Jesucristo, sabemos que para los que vivimos en la tierra es muy difícil vivir sin cometer ningún tipo de pecado y a veces algunos no podemos resistirnos ante las tentaciones del enemigo, por esa razón te pedimos por '+n+' que tengas inmensa bondad, si en algo desvió en su vida y no pudo arrepentirse al final. Te lo pedimos en el octavo día del Novenario que estamos celebrando.';},
        function(n,g){var herm=g==='female'?'hermana':'hermano';return 'Señor mío Jesucristo, nos presentamos de nuevo ante ti todos los hermanos reunidos en este Novenario por nuestro(a) '+herm+' '+n+' que anhela ver tu luz, esperamos le permitas llegar hasta tu gloria después de perdonarlos de todos sus pecados. Te lo pedimos en el noveno día del Novenario hoy concluimos.';}
      ],
      OFlbl:'Padre Nuestro',HMlbl:'Ave María',HMnote:'🙏 Rezar 10 veces',
      GBlbl:'Gloria al Padre',FAlbl:'Jaculatorias',
      signLbl:'Nos persignamos',yoPecadorLbl:'Yo Pecador',gloriaLbl:'Gloria',
      intentionLbl:'Intención del día',
      rosaryLbl:'El Rosario',nextMystery:'Siguiente Misterio →',
      oracionesFinalesLbl:'Oraciones Finales',letaniaLbl:'Letanía',oracionFinalLbl:'Oración Final',
      finalBanner:'Día Final — Conclusión del Novenario',
      conclusionOf:'Conclusión del Novenario por',novenFor:'Novena por',
      ordinals:['Primer','Segundo','Tercer','Cuarto','Quinto'],
      daysFull:['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
      daysShort:['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
      dayLbl:'Día',ofLbl:'de',finalLbl:'Final',
      readAloud:'Leer en voz alta',pause:'Pausa',resume:'Continuar',stop:'Detener',
      resetBtn:'Reiniciar Novena',
      countdownMsg:function(n){return 'La novena por '+n+' comenzará en ';},
      countdownDays:function(d){return d===1?'1 día':''+d+' días';},
      glorious:{name:'Misterios Gloriosos',list:[
        ['La Resurrección del Hijo de Dios','«El primer día de la semana, muy de mañana, fueron al sepulcro llevando los aromas que habían preparado. Pero encontraron que la piedra había sido retirada del sepulcro, y entraron, pero no hallaron el cuerpo del Señor Jesús. No sabían que pensar de esto, cuando se presentaron ante ellas dos hombres con vestidos resplandecientes. Ellas, despavoridas, miraban al suelo, y ellos les dijeron: ¿Por qué buscáis entre los muertos al que está vivo? No está aquí, ha Resucitado» (Lc 24, 1-6).'],
        ['La Ascensión del Señor al Cielo','«El Señor Jesús, después de hablarles, ascendió al Cielo y se sentó a la derecha de Dios» (Mc 16, 19).'],
        ['La venida del Espíritu Santo','«Al llegar el día de Pentecostés, estaban todos reunidos en un mismo lugar. De repente vino del cielo un ruido como el de una ráfaga de viento impetuoso, que llenó toda la casa en la que se encontraban. Se les aparecieron unas lenguas como de fuego que se repartieron y se posaron sobre cada uno de ellos; quedaron todos llenos del Espíritu Santo y se pusieron a hablar en otras lenguas, según el Espíritu les concedía expresarse» (Hch 2, 1-4).'],
        ['La Asunción de María al Cielo','«Todas las generaciones me llamarán bienaventurada porque el Señor ha hecho obras grandes en mí» (Lc 1, 48-49).'],
        ['La Coronación de María como Reina y Señora de todo lo creado','«Una gran señal apareció en el cielo: una Mujer, vestida de sol, con la luna bajo sus pies, y una corona de doce estrellas sobre Su cabeza» (Ap 12, 1).']
      ]},
      joyful:{name:'Misterios Gozosos',list:[
        ['La Encarnación del Hijo de Dios','«Al sexto mes el Ángel Gabriel fue enviado por Dios a una ciudad de Galilea, llamada Nazaret, a una virgen desposada con un hombre llamado José, de la estirpe de David; el nombre de la virgen era María» (Lc 1,26-27).'],
        ['La Visitación de Nuestra Señora a su prima Santa Isabel','«En aquellos días María se puso en camino y fue aprisa a la región montañosa, a una ciudad de Judá; entró en casa de Zacarías y saludó a Isabel. Y sucedió que, en cuanto Isabel oyó el saludo de María, saltó de gozo el niño en su seno, e Isabel quedó llena de Espíritu Santo; y exclamando a voz en grito, dijo: Bendita tú entre las mujeres y bendito el Fruto de tu Vientre» (Lc 1, 39-42).'],
        ['El Nacimiento del Hijo de Dios en el portal de Belén','«Sucedió que por aquellos días salió un edicto de César Augusto ordenando que se empadronase todo el mundo. Este primer empadronamiento tuvo lugar siendo Cirino gobernador de Siria. Iban todos a empadronarse, cada uno a su ciudad. Subió también José desde Galilea, de la ciudad de Nazaret, a Judea, a la ciudad de David, que se llama Belén, por ser él de la casa y familia de David, para empadronarse con María, su esposa, que estaba encinta. Y sucedió que, mientras ellos estaban allí, se le cumplieron los días del alumbramiento, y dio a luz a su Hijo Primogénito, le envolvió en pañales y le acostó en un pesebre, porque no tenían sitio en el alojamiento» (Lc 2,1-7).'],
        ['La presentación de Jesús en el Templo','«Cuando se cumplieron los ocho días para circuncidarle, se le dio el nombre de Jesús, como lo había llamado el ángel antes de ser concebido en el seno. Cuando se cumplieron los días de la purificación de ellos, según la Ley de Moisés, llevaron a Jesús a Jerusalén para presentarle al Señor» (Lc 2, 21-24).'],
        ['El Niño Jesús perdido y hallado en el Templo','«Sus padres iban todos los años a Jerusalén a la fiesta de la Pascua. Cuando tuvo doce años, subieron ellos como de costumbre a la fiesta y, al volverse, pasados los días, el niño Jesús se quedó en Jerusalén, sin saberlo sus padres… Y sucedió que, al cabo de tres días, le encontraron en el Templo sentado en medio de los maestros, escuchándoles y preguntándoles; todos los que le oían, estaban estupefactos por su inteligencia y sus respuestas» (Lc 2, 41-47).']
      ]},
      sorrowful:{name:'Misterios Dolorosos',list:[
        ['La oración en el Huerto','«Entonces Jesús fue con ellos a un huerto, llamado Getsemaní, y dijo a sus discípulos: Sentaos aquí mientras voy a orar. Y tomando consigo a Pedro y a los dos hijos de Zebedeo, comenzó a sentir tristeza y angustia. Entonces les dijo: Mi alma está triste hasta el punto de morir; quedaos aquí y velad conmigo. Y adelantándose un poco, cayó rostro en tierra, y suplicaba así: Padre mío, si es posible, que pase de mí esta copa, pero no sea como Yo quiero, sino como quieras Tú» (Mt 26, 36-39).'],
        ['La flagelación del Señor','«Pilato entonces tomó a Jesús y mandó azotarle» (Jn 19,1-3).'],
        ['La coronación de espinas','«Entonces los soldados del procurador llevaron consigo a Jesús al pretorio y reunieron alrededor de Él a toda la cohorte. Lo desnudaron y le echaron encima un manto de púrpura y, trenzando una corona de espinas, se la pusieron sobre la cabeza, y en su mano derecha una caña, y doblando la rodilla delante de Él, le hacían burla diciendo: Salve, Rey de los judíos» (Mt 27, 27-29).'],
        ['Jesús con la Cruz a cuestas camino del Calvario','«Entonces Pilato se lo entregó para que lo crucifiquen, y ellos se lo llevaron. Jesús, cargando sobre sí la cruz, salió de la ciudad para dirigirse al lugar llamado del Cráneo, en hebreo Gólgota» (Jn 19, 16-17).'],
        ['La crucifixión y muerte de Jesús','«Llegados al lugar llamado La Calavera, le crucificaron allí a Él y a los dos malhechores, uno a la derecha y otro a la izquierda. Jesús decía: Padre, perdónales, porque no saben lo que hacen… Era ya eso de mediodía cuando, al eclipsarse el sol, hubo oscuridad sobre toda la tierra hasta la media tarde. El velo del Santuario se rasgó por medio y Jesús, dando un fuerte grito dijo: Padre, en tus manos pongo mi espíritu y, dicho esto, expiró» (Lc 23, 33-46).']
      ]},
      luminous:{name:'Misterios Luminosos',list:[
        ['El Bautismo en el Jordán','«Bautizado Jesús, salió luego del agua; y en esto se abrieron los cielos y vio al Espíritu de Dios que bajaba en forma de paloma y venía sobre Él. Y una voz que salía de los cielos decía: Este es Mi Hijo amado, en quien me complazco» (Mt 3,16-17).'],
        ['Las bodas de Caná','«Tres días después se celebraba una boda en Caná de Galilea y estaba allí la madre de Jesús. Fue invitado también a la boda Jesús con sus discípulos. Y, como faltara vino, porque se había acabado el vino de la boda, le dice a Jesús su madre: No tienen vino. Jesús le responde: ¿Qué tengo yo contigo, mujer? Todavía no ha llegado mi hora. Dice su madre a los sirvientes: Haced lo que Él os diga» (Jn 2, 1-5).'],
        ['El anuncio del Reino de Dios','«El tiempo se ha cumplido y el Reino de Dios está cerca; convertíos y creed en el Evangelio» (Mc 1, 15).'],
        ['La Transfiguración','«Seis días después, Jesús tomó consigo a Pedro, a Santiago y a su hermano Juan, y los llevó aparte, a un monte alto. Y se transfiguró delante de ellos: Su rostro se puso brillante como el sol y sus vestidos se volvieron blancos como la luz» (Mt 17, 1-2).'],
        ['La Institución de la Eucaristía','«Mientras estaban comiendo, tomó Jesús pan y lo bendijo, lo partió y, dándoselo a sus discípulos, dijo: Tomad, comed, éste es Mi Cuerpo» (Mt 26, 26).']
      ]},
      days:{
        0:{ros:'glorious'},1:{ros:'joyful'},2:{ros:'sorrowful'},
        3:{ros:'glorious'},4:{ros:'luminous'},5:{ros:'sorrowful'},6:{ros:'joyful'}
      }
    };

    var EN={
      sign:'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
      yoPecador:'I confess to Almighty God, and to you my brothers and sisters, that I have sinned through my own fault, in my thoughts and in my words, in what I have done and in what I have failed to do. And I ask the Blessed Mary ever Virgin, all the angels and saints, and you my brothers and sisters, to pray for me to the Lord our God. Amen.',
      gloria:'Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.',
      OF:'Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.',
      HM:'Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
      jacFunc:function(n,g){
        return ['Lord, by Your precious blood You have redeemed them; we ask that You forgive them through Your sorrowful Passion.',
          'Grant them, O Lord, eternal rest, and let perpetual light shine upon them.',
          'May Your infinite mercy, O Lord, grant peace to the soul of '+n+' and to all the faithful departed. Amen.'];
      },
      oracionFinalFunc:function(n,g){
        return 'Lord Jesus Christ, who died on the cross and rose on the third day, redeeming us and forgiving the sins of the world, we ask that Your holy redemption reach '+n+' and that they rejoice with You in heaven in eternal life. Amen. Holy Mary of Guadalupe, Mother of God, we ask you to intercede for '+n+', for whom we pray this Novena, so that their soul may reach heaven after being purified and enjoy eternal glory. Amen.';
      },
      oracionesFinales:'Hail Mary, most holy, Daughter of God the Father, most pure Virgin before childbirth, in your hands we place our faith that you may enlighten it. Full of grace, the Lord is with you. Blessed are you among all women and blessed is the fruit of your womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen. Hail Mary, most holy, Mother of God the Son, most pure Virgin in childbirth, in your hands we place our hope that you may strengthen it. Full of grace, the Lord is with you. Blessed are you among all women and blessed is the fruit of your womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen. Hail Mary, most holy, Spouse of God the Holy Spirit, most pure Virgin after childbirth, in your hands we place our charity that you may enflame it. Full of grace, the Lord is with you. Blessed are you among all women and blessed is the fruit of your womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen. Hail, Holy Queen, Mother of Mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this exile show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O Holy Mother of God, that we may be made worthy of the promises of Christ. Amen.',
      intentiones:[
        function(n,g){return 'My Lord, I come before You to ask that You help us obtain eternal rest for '+n+' who has ended their life in this world and now enjoys Your presence in heaven. May the intercession of Our Most Holy Mother of Guadalupe accompany them before Your presence. We ask this on the first day of the Novena we are celebrating.';},
        function(n,g){return 'O Lord Our Jesus Christ, we know that You are merciful and just with us, and for this reason we gather in this novena to pray for '+n+' who has departed from this world. We implore mercy for their soul, that it may be freed from all guilt and attain eternal peace. We ask this on the second day of the Novena we are celebrating.';},
        function(n,g){return 'My Lord Jesus Christ, we understand that Your justice is great. We pray for the soul of '+n+' who has left this world, that You grant the forgiveness of their sins and faults, for perhaps through lack of time or will they did not repent of their errors on earth. Help them attain Your eternal peace. We ask this on the third day of the Novena we are celebrating.';},
        function(n,g){return 'O my Lord, we ask that You assist the soul of '+n+' so that, amending their failings and being purified, they may attain eternal glory and enjoy the fullness of eternal life. We ask this on the fourth day of the Novena we are celebrating.';},
        function(n,g){return 'My Lord Jesus Christ, we adore and praise You, thanking You for having mercy on the soul of '+n+' who perhaps was not always faithful to the Gospel in this world. But we know that in Your infinite goodness You always seek the repentance of the sinner. We ask this on the fifth day of the Novena we are celebrating.';},
        function(n,g){return 'My Lord Jesus Christ, You who command us to honor our parents in Your commandments so that all may go well for us and our days on earth may be long. We present before Your mercy the soul of '+n+', that You grant them Your light and that they fully attain salvation. We ask this on the sixth day of the Novena we are celebrating.';},
        function(n,g){return 'My Lord Jesus Christ, we pray for the soul of '+n+' that You grant them a place in Your glory after purifying their sins and attaining the fullness of salvation. We ask this on the seventh day of the Novena we are celebrating.';},
        function(n,g){return 'My Lord Jesus Christ, we know that for those of us living on earth it is very difficult to live without committing any kind of sin, and sometimes we cannot resist the temptations of the enemy. For this reason we ask You for '+n+', that You have immense goodness toward them if in some way they strayed in their life and could not repent at the end. We ask this on the eighth day of the Novena we are celebrating.';},
        function(n,g){return 'My Lord Jesus Christ, we present ourselves again before You, all gathered in this Novena for '+n+' who longs to see Your light. We hope You will allow them to reach Your glory after forgiving them of all their sins. We ask this on the ninth day of the Novena, which we conclude today.';}
      ],
      OFlbl:'Our Father',HMlbl:'Hail Mary',HMnote:'🙏 Pray 10 times',
      GBlbl:'Glory Be',FAlbl:'Prayers after the decade',
      signLbl:'Sign of the Cross',yoPecadorLbl:'Confiteor',gloriaLbl:'Gloria',
      intentionLbl:'Intention of the day',
      rosaryLbl:'The Rosary',nextMystery:'Next Mystery →',
      oracionesFinalesLbl:'Closing Prayers',letaniaLbl:'Litany',oracionFinalLbl:'Final Prayer',
      finalBanner:'Final Day — Conclusion of the Novenario',
      conclusionOf:'Conclusion of the Novenario for',novenFor:'Novena for',
      ordinals:['First','Second','Third','Fourth','Fifth'],
      daysFull:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      daysShort:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
      dayLbl:'Day',ofLbl:'of',finalLbl:'Final',
      readAloud:'Read aloud',pause:'Pause',resume:'Resume',stop:'Stop',
      resetBtn:'Reset Novena',
      countdownMsg:function(n){return 'The novena for '+n+' begins in ';},
      countdownDays:function(d){return d===1?'1 day':''+d+' days';},
      glorious:{name:'Glorious Mysteries',list:[
        ['The Resurrection of the Son of God','On the first day of the week, very early in the morning, the women went to the tomb. They found the stone rolled away and did not find the body of the Lord Jesus. Two men in dazzling clothes said to them: Why do you look for the living among the dead? He is not here; He has risen! (Lk 24:1-6)'],
        ['The Ascension of the Lord into Heaven','After the Lord Jesus had spoken to them, He was taken up into heaven and He sat at the right hand of God. (Mk 16:19)'],
        ['The Coming of the Holy Spirit','When the day of Pentecost came, they were all together in one place. Suddenly a sound like the blowing of a violent wind came from heaven and filled the whole house. They saw what seemed to be tongues of fire that separated and came to rest on each of them. All of them were filled with the Holy Spirit. (Acts 2:1-4)'],
        ['The Assumption of Mary into Heaven','From now on all generations will call me blessed, for the Mighty One has done great things for me. (Lk 1:48-49)'],
        ['The Coronation of Mary as Queen and Lady of all Creation','A great sign appeared in heaven: a woman clothed with the sun, with the moon under her feet and a crown of twelve stars on her head. (Rev 12:1)']
      ]},
      joyful:{name:'Joyful Mysteries',list:[
        ['The Incarnation of the Son of God','In the sixth month, God sent the angel Gabriel to Nazareth, a town in Galilee, to a virgin pledged to be married to a man named Joseph, a descendant of David. The virgin\'s name was Mary. (Lk 1:26-27)'],
        ['The Visitation of Our Lady to her cousin Saint Elizabeth','Mary set out and hurried to a town in the hill country of Judah, where she entered the home of Zechariah and greeted Elizabeth. When Elizabeth heard Mary\'s greeting, the baby leaped in her womb, and Elizabeth was filled with the Holy Spirit. Blessed are you among women, and blessed is the child you will bear! (Lk 1:39-42)'],
        ['The Birth of the Son of God in Bethlehem','While they were there, the time came for the baby to be born, and she gave birth to her firstborn, a son. She wrapped him in cloths and placed him in a manger, because there was no guest room available for them. (Lk 2:6-7)'],
        ['The Presentation of Jesus in the Temple','When the time came for the purification rites required by the Law of Moses, Joseph and Mary took him to Jerusalem to present him to the Lord. (Lk 2:22)'],
        ['The Finding of Jesus in the Temple','After three days they found him in the temple courts, sitting among the teachers, listening to them and asking them questions. Everyone who heard him was amazed at his understanding and his answers. (Lk 2:46-47)']
      ]},
      sorrowful:{name:'Sorrowful Mysteries',list:[
        ['The Agony in the Garden','Jesus went to a place called Gethsemane. He said to his disciples: Sit here while I go over there and pray. He fell with his face to the ground and prayed: My Father, if it is possible, may this cup be taken from me. Yet not as I will, but as you will. (Mt 26:36-39)'],
        ['The Scourging at the Pillar','Then Pilate took Jesus and had him flogged. (Jn 19:1)'],
        ['The Crowning with Thorns','The soldiers twisted together a crown of thorns and put it on his head. They clothed him in a purple robe and went up to him again and again, saying: Hail, king of the Jews! (Jn 19:2-3)'],
        ['The Carrying of the Cross','Carrying his own cross, he went out to the place of the Skull, which in Aramaic is called Golgotha. (Jn 19:17)'],
        ['The Crucifixion and Death of Jesus','When they came to the place called the Skull, they crucified him there. Jesus said: Father, forgive them, for they do not know what they are doing. Jesus called out with a loud voice: Father, into your hands I commit my spirit. When he had said this, he breathed his last. (Lk 23:33-46)']
      ]},
      luminous:{name:'Luminous Mysteries',list:[
        ['The Baptism in the Jordan','As soon as Jesus was baptized, he went up out of the water. At that moment heaven was opened, and he saw the Spirit of God descending like a dove and alighting on him. And a voice from heaven said: This is my Son, whom I love; with him I am well pleased. (Mt 3:16-17)'],
        ['The Wedding at Cana','On the third day a wedding took place at Cana in Galilee. When the wine was gone, Jesus\'s mother said to him: They have no more wine. His mother said to the servants: Do whatever he tells you. (Jn 2:1-5)'],
        ['The Proclamation of the Kingdom of God','The time has come. The kingdom of God has come near. Repent and believe the good news! (Mk 1:15)'],
        ['The Transfiguration','After six days Jesus took with him Peter, James and John the brother of James, and led them up a high mountain by themselves. There he was transfigured before them. His face shone like the sun, and his clothes became as white as the light. (Mt 17:1-2)'],
        ['The Institution of the Eucharist','While they were eating, Jesus took bread, and when he had given thanks, he broke it and gave it to his disciples, saying: Take and eat; this is my body. (Mt 26:26)']
      ]},
      days:{
        0:{ros:'glorious'},1:{ros:'joyful'},2:{ros:'sorrowful'},
        3:{ros:'glorious'},4:{ros:'luminous'},5:{ros:'sorrowful'},6:{ros:'joyful'}
      }
    };

    function L(){return lang==='en'?EN:ES;}

    function sT(t){return '<p style="font-family:Georgia,serif;font-size:1.1rem;font-weight:500;margin:1.5rem 0 .4rem;">'+t+'</p>';}
    function sP(t){return '<p style="margin-bottom:.75rem;line-height:1.9;">'+t+'</p>';}
    function sSc(t){return '<blockquote style="border-left:2px solid rgba(128,128,128,0.4);padding-left:1rem;margin:.5rem 0 .75rem;font-style:italic;font-size:1rem;line-height:1.8;opacity:0.85;">'+t+'</blockquote>';}

    function mBlock(rosKey,idx){
      var l=L(),m=l[rosKey],ord=l.ordinals[idx];
      var title=m.list[idx][0],med=m.list[idx][1];
      var jac=l.jacFunc(userName,gender);
      return '<div id="mystery-'+idx+'" style="margin:1rem 0;padding:1rem 1.25rem;border:1px solid rgba(128,128,128,0.2);border-radius:8px;">'
        +'<p style="font-family:Georgia,serif;font-size:1.05rem;font-weight:500;margin-bottom:.4rem;">'+ord+' Misterio: '+title+'</p>'
        +'<p style="font-size:.95rem;opacity:0.7;font-style:italic;margin-bottom:.75rem;line-height:1.7;">'+med+'</p>'
        +'<p style="font-size:1rem;font-weight:500;margin-bottom:.4rem;">'+l.OFlbl+'</p>'
        +'<p style="margin-bottom:.6rem;line-height:1.8;">'+l.OF+'</p>'
        +'<p style="font-size:1rem;font-weight:500;margin:.6rem 0 .2rem;">'+l.HMlbl+'</p>'
        +'<p style="margin-bottom:.4rem;line-height:1.8;">'+l.HM+'</p>'
        +'<p style="font-size:.9rem;opacity:0.6;font-style:italic;margin-bottom:.6rem;padding:.4rem .6rem;border:1px dashed rgba(128,128,128,0.3);border-radius:6px;">'+l.HMnote+'</p>'
        +'<p style="font-size:1rem;font-weight:500;margin:.6rem 0 .4rem;">'+l.GBlbl+'</p>'
        +'<p style="margin-bottom:.6rem;line-height:1.8;">'+l.gloria+'</p>'
        +'<p style="font-size:1rem;font-weight:500;margin:.6rem 0 .4rem;">'+l.FAlbl+'</p>'
        +jac.map(function(j){return '<p style="margin-bottom:.4rem;line-height:1.8;">'+j+'</p>';}).join('')
        +(idx<4?'<div style="display:flex;gap:8px;margin-top:1rem;flex-wrap:wrap;">'
          +'<button id="nxt-'+idx+'" style="padding:7px 16px;border:1px solid rgba(128,128,128,0.5);border-radius:6px;background:transparent;color:inherit;cursor:pointer;font-family:Georgia,serif;font-size:13px;">'+l.nextMystery+'</button>'
          +'<button id="mpause-'+idx+'" style="padding:7px 16px;border:1px solid rgba(128,128,128,0.5);border-radius:6px;background:transparent;color:inherit;cursor:pointer;font-family:Georgia,serif;font-size:13px;display:none;">'+l.pause+'</button>'
          +'<button id="mstop-'+idx+'" style="padding:7px 16px;border:1px solid rgba(128,128,128,0.5);border-radius:6px;background:transparent;color:inherit;cursor:pointer;font-family:Georgia,serif;font-size:13px;display:none;">'+l.stop+'</button>'
          +'</div>':'')
        +'</div>';
    }

    function rosaryHtml(rosKey){
      var l=L(),m=l[rosKey],h='';
      h+=sT(l.rosaryLbl+' — '+m.name);
      for(var i=0;i<5;i++)h+=mBlock(rosKey,i);
      return h;
    }

    function buildDay(dayIdx,dow){
      var l=L(),h='';
      currentRosKey=l.days[dow].ros;
      h+=sT(l.signLbl)+sP(l.sign);
      h+=sT(l.yoPecadorLbl)+sP(l.yoPecador);
      h+=sT(l.gloriaLbl)+sP(l.gloria);
      h+=sT(l.intentionLbl)+sP(l.intentiones[dayIdx](userName,gender));
      h+=rosaryHtml(currentRosKey);
      h+=sT(l.oracionesFinalesLbl)+sP(l.oracionesFinales);
      h+=sT(l.oracionFinalLbl)+sP(l.oracionFinalFunc(userName,gender));
      return h;
    }

    function buildCal(){
      var g=document.getElementById('cal-grid'),l=L();g.innerHTML='';
      var today=new Date();today.setHours(0,0,0,0);
      for(var i=0;i<9;i++){
        var d=addDays(novenaStart,i),fin=i===8;
        var isPast=d<today,isToday=d.getTime()===today.getTime();
        var el=document.createElement('div');
        el.style.cssText='text-align:center;padding:7px 3px;border:1px solid rgba(128,128,128,0.3);border-radius:7px;cursor:pointer;'
          +(fin?'border-style:dashed;':'')
          +(isToday?'outline:2px solid currentColor;':'')
          +(isPast&&!isToday?'opacity:0.5;':'');
        el.innerHTML='<div style="font-size:10px;opacity:0.6;">'+l.daysShort[d.getDay()]+'</div>'
          +'<div style="font-size:13px;font-weight:500;">'+d.getDate()+'</div>'
          +'<div style="font-size:9px;opacity:0.6;">'+(fin?l.finalLbl:l.dayLbl+' '+(i+1))+'</div>';
        el.id='calDay'+i;
        (function(idx){el.addEventListener('click',function(){goTo(idx);});})(i);
        g.appendChild(el);
      }
    }

    function showDay(idx){
      stopSpeak();currentDay=idx;
      for(var i=0;i<9;i++){
        var el=document.getElementById('calDay'+i);
        if(el)el.style.outline=i===idx?'2px solid currentColor':'none';
      }
      var d=addDays(novenaStart,idx),l=L(),dow=d.getDay();
      var today=new Date();today.setHours(0,0,0,0);
      var daysUntil=Math.floor((novenaStart-today)/(1000*60*60*24));

      document.getElementById('final-banner').style.display=idx===8?'block':'none';
      document.getElementById('final-banner').textContent=l.finalBanner;
      document.getElementById('dayLabel').textContent=l.dayLbl+' '+(idx+1)+' '+l.ofLbl+' 9';
      document.getElementById('dayDate').textContent=fmtDate(d);
      document.getElementById('prevTop').disabled=idx===0;
      document.getElementById('prevBot').disabled=idx===0;
      document.getElementById('nextTop').disabled=idx===8;
      document.getElementById('nextBot').disabled=idx===8;
      document.getElementById('speakTop').textContent=l.readAloud;
      document.getElementById('speakBot').textContent=l.readAloud;

      if(daysUntil>0 && idx===0){
        document.getElementById('dayHeading').textContent=l.countdownMsg(userName)+l.countdownDays(daysUntil);
        document.getElementById('prayerBody').innerHTML='<p style="text-align:center;opacity:0.6;font-style:italic;margin-top:2rem;">'+l.countdownMsg(userName)+l.countdownDays(daysUntil)+'</p>';
      } else {
        document.getElementById('dayHeading').textContent=l.novenFor+' '+userName+' — '+l.daysFull[dow];
        document.getElementById('prayerBody').innerHTML=buildDay(idx,dow);
        attachMysteryButtons();
      }
    }

    function attachMysteryButtons(){
      for(var i=0;i<4;i++){
        (function(idx){
          var btn=document.getElementById('nxt-'+idx);
          if(btn)btn.addEventListener('click',function(){
            stopSpeak();
            var el=document.getElementById('mystery-'+(idx+1));
            if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
            speakMysteryInParts(currentRosKey,idx+1);
          });
          var pbtn=document.getElementById('mpause-'+idx);
          if(pbtn)pbtn.addEventListener('click',function(){
            if(!currentAudio)return;
            if(paused){currentAudio.play();paused=false;pbtn.textContent=L().pause;}
            else{currentAudio.pause();paused=true;pbtn.textContent=L().resume;}
          });
          var sbtn=document.getElementById('mstop-'+idx);
          if(sbtn)sbtn.addEventListener('click',function(){stopSpeak();});
        })(i);
      }
    }

    function changeDay(dir){var n=currentDay+dir;if(n<0||n>8)return;goTo(n);}
    function goTo(idx){stopSpeak();showDay(idx);}

    async function playFixed(fixedKey){
      var url='https://novenaaudio.blob.core.windows.net/novena-audio/fixed-'+fixedKey+'-'+lang+'.mp3';
      return new Promise(function(resolve,reject){
        currentAudio=new Audio(url);
        currentAudio.onended=resolve;
        currentAudio.onerror=function(e){console.error("audio error:",e);resolve();};
        currentAudio.play();
      });
    }

    async function speakOne(text,cacheKey){
      var res=await fetch('/api/speak',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text.slice(0,2000),language:lang,cacheKey:cacheKey})});
      if(!res.ok)throw new Error('failed');
      var blob=await res.blob();
      var url=URL.createObjectURL(blob);
      return new Promise(function(resolve,reject){
        currentAudio=new Audio(url);
        currentAudio.onended=resolve;
        currentAudio.onerror=reject;
        currentAudio.play();
      });
    }

    async function speakMysteryInParts(rosKey,idx){
      speaking=true;paused=false;updateSpeakUI();
      try{
        var l=L(),m=l[rosKey];
        var title=m.list[idx][0],med=m.list[idx][1];
        var ord=l.ordinals[idx];
        var introText=ord+' Misterio: '+title+'. '+med+' '+l.OFlbl+': '+l.OF;
        await speakOne(introText,'mystery-intro-'+rosKey+'-'+idx+'-'+lang);
        for(var hm=0;hm<10;hm++){try{await playFixed('HM');}catch(e){console.error('HM '+hm+' failed:',e);}}
        await playFixed('GB');
        var jac=l.jacFunc(userName,gender);
        await speakOne(jac.join(' '),null);
      }catch(e){console.error(e);}
      speaking=false;paused=false;updateSpeakUI();
    }

    async function toggleSpeak(){
      if(speaking){stopSpeak();return;}
      speaking=true;paused=false;updateSpeakUI();
      try{
        var l=L(),dow=addDays(novenaStart,currentDay).getDay();
        var text=l.signLbl+'. '+l.sign+' '+l.yoPecadorLbl+'. '+l.yoPecador+' '+l.gloriaLbl+'. '+l.gloria+' '+l.intentionLbl+'. '+l.intentiones[currentDay](userName,gender);
        await speakOne(text,null);
        await speakMysteryInParts(currentRosKey,0);
      }catch(e){console.error(e);}
      speaking=false;paused=false;updateSpeakUI();
    }

    function togglePause(){
      if(!currentAudio)return;
      if(paused){currentAudio.play();paused=false;}
      else{currentAudio.pause();paused=true;}
      updateSpeakUI();
    }

    function stopSpeak(){
      speaking=false;paused=false;
      if(currentAudio){currentAudio.pause();currentAudio.currentTime=0;currentAudio=null;}
      updateSpeakUI();
    }

    function updateSpeakUI(){
      var l=L();
      ['Top','Bot'].forEach(function(s){
        document.getElementById('speak'+s).style.display=speaking?'none':'inline-block';
        document.getElementById('pause'+s).style.display=speaking?'inline-block':'none';
        document.getElementById('pause'+s).textContent=paused?l.resume:l.pause;
        document.getElementById('stop'+s).style.display=speaking?'inline-block':'none';
        document.getElementById('stop'+s).textContent=l.stop;
      });
    }

    function getPlainText(){var c=document.getElementById('prayerBody').cloneNode(true);return c.innerText||c.textContent||'';}
    function copyPrayer(){
      navigator.clipboard.writeText(getPlainText()).then(function(){
        ['Top','Bot'].forEach(function(s){document.getElementById('copy'+s).textContent='Copied!';});
        setTimeout(function(){['Top','Bot'].forEach(function(s){document.getElementById('copy'+s).textContent='Copy';});},2000);
      });
    }

    document.getElementById('btnEn').addEventListener('click',function(){setLang('en');});
    document.getElementById('btnEs').addEventListener('click',function(){setLang('es');});
    document.getElementById('btnMale').addEventListener('click',function(){setGender('male');});
    document.getElementById('btnFemale').addEventListener('click',function(){setGender('female');});
    document.getElementById('beginBtn').addEventListener('click',beginNovena);
    document.getElementById('resetBtn').addEventListener('click',resetNovena);
    document.getElementById('prevTop').addEventListener('click',function(){changeDay(-1);});
    document.getElementById('nextTop').addEventListener('click',function(){changeDay(1);});
    document.getElementById('prevBot').addEventListener('click',function(){changeDay(-1);});
    document.getElementById('nextBot').addEventListener('click',function(){changeDay(1);});
    document.getElementById('speakTop').addEventListener('click',toggleSpeak);
    document.getElementById('pauseTop').addEventListener('click',togglePause);
    document.getElementById('stopTop').addEventListener('click',stopSpeak);
    document.getElementById('speakBot').addEventListener('click',toggleSpeak);
    document.getElementById('pauseBot').addEventListener('click',togglePause);
    document.getElementById('stopBot').addEventListener('click',stopSpeak);
    document.getElementById('copyTop').addEventListener('click',copyPrayer);
    document.getElementById('copyBot').addEventListener('click',copyPrayer);

    // Initialize
    loadSaved();
    if(userName && novenaStart){
      setLang(lang);
      setGender(gender);
      document.getElementById('form-section').style.display='none';
      document.getElementById('novena-section').style.display='block';
      buildCal();showDay(currentDay);
    } else {
      setLang('en');
      setGender('male');
    }

  },[]);

  return (
    <div style={{padding:'2rem 1.25rem 3rem',fontFamily:'Georgia,serif',maxWidth:'720px',margin:'0 auto'}}>
      <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
        <span style={{fontSize:'20px',opacity:0.5,display:'block',marginBottom:'.4rem'}}>✝</span>
        <h1 id="mainTitle" style={{fontFamily:'Georgia,serif',fontSize:'1.9rem',fontWeight:500,lineHeight:1.2}}>Novena for the Dead</h1>
        <p id="sub" style={{fontSize:'.9rem',opacity:0.6,fontStyle:'italic',marginTop:'.3rem'}}>Nine days of prayer</p>
      </div>
      <hr style={{border:'none',borderTop:'1px solid rgba(128,128,128,0.3)',margin:'1.5rem 0'}} />
      <div id="form-section">
        <p style={{fontSize:'11px',letterSpacing:'.05em',textTransform:'uppercase',opacity:0.6,marginBottom:'6px'}}>Language</p>
        <div style={{display:'flex',gap:'8px',marginBottom:'1.25rem'}}>
          <button id="btnEn" style={{padding:'8px 22px',border:'2px solid currentColor',borderRadius:'8px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'14px',fontWeight:500}}>English</button>
          <button id="btnEs" style={{padding:'8px 22px',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'8px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'14px'}}>Español</button>
        </div>
        <div id="gender-section" style={{display:'none',marginBottom:'1.25rem'}}>
          <p style={{fontSize:'11px',letterSpacing:'.05em',textTransform:'uppercase',opacity:0.6,marginBottom:'6px'}}>El difunto es</p>
          <div style={{display:'flex',gap:'8px'}}>
            <button id="btnMale" style={{padding:'6px 18px',border:'2px solid currentColor',borderRadius:'8px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'13px'}}>Hombre</button>
            <button id="btnFemale" style={{padding:'6px 18px',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'8px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'13px'}}>Mujer</button>
          </div>
        </div>
        <p id="lbl-for" style={{fontSize:'11px',letterSpacing:'.05em',textTransform:'uppercase',opacity:0.6,marginBottom:'6px'}}>This novena is offered for</p>
        <input id="nameInput" type="text" placeholder="e.g. Maria Santos"
          style={{width:'100%',padding:'10px 14px',fontSize:'16px',fontFamily:'Georgia,serif',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'8px',background:'transparent',color:'inherit',display:'block',marginBottom:'1.25rem',boxSizing:'border-box'}} />
        <p id="lbl-startdate" style={{fontSize:'11px',letterSpacing:'.05em',textTransform:'uppercase',opacity:0.6,marginBottom:'6px'}}>Start date</p>
        <input id="startDateInput" type="date"
          style={{width:'100%',padding:'10px 14px',fontSize:'16px',fontFamily:'Georgia,serif',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'8px',background:'transparent',color:'inherit',display:'block',marginBottom:'1.5rem',boxSizing:'border-box'}} />
        <p id="errMsg" style={{color:'red',fontSize:'13px',marginBottom:'8px',display:'none'}}>Please enter a name first.</p>
        <button id="beginBtn" style={{width:'100%',padding:'13px',fontSize:'1.05rem',fontFamily:'Georgia,serif',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'8px',background:'transparent',color:'inherit',cursor:'pointer'}}>Begin the Novena ✝</button>
      </div>
      <div id="novena-section" style={{display:'none'}}>
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'8px'}}>
          <button id="resetBtn" style={{fontSize:'12px',background:'none',border:'none',cursor:'pointer',textDecoration:'underline',opacity:0.5,color:'inherit'}}>Reset Novena</button>
        </div>
        <div id="cal-grid" style={{display:'grid',gridTemplateColumns:'repeat(9,1fr)',gap:'4px',marginBottom:'1.25rem'}}></div>
        <div style={{border:'1px solid rgba(128,128,128,0.3)',borderRadius:'12px',overflow:'hidden'}}>
          <div id="final-banner" style={{display:'none',textAlign:'center',padding:'.6rem',borderBottom:'1px solid rgba(128,128,128,0.3)',fontSize:'11px',letterSpacing:'.07em',textTransform:'uppercase',opacity:0.6}}></div>
          <div style={{padding:'1.25rem 1.5rem 1rem',borderBottom:'1px solid rgba(128,128,128,0.3)'}}>
            <p id="dayLabel" style={{fontSize:'11px',textTransform:'uppercase',letterSpacing:'.06em',opacity:0.6,marginBottom:'3px'}}></p>
            <p id="dayHeading" style={{fontFamily:'Georgia,serif',fontSize:'1.3rem',fontWeight:500,fontStyle:'italic',marginBottom:'3px'}}></p>
            <p id="dayDate" style={{fontSize:'13px',opacity:0.6}}></p>
          </div>
          <div style={{padding:'.6rem 1.25rem',borderBottom:'1px solid rgba(128,128,128,0.3)',display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}>
            <span style={{fontSize:'12px',opacity:0.6}}>Voice: Jenny (EN) · Dalia (ES)</span>
            <div style={{flex:1}}></div>
            <button id="speakTop" style={{padding:'6px 14px',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'6px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'13px'}}>Read aloud</button>
            <button id="pauseTop" style={{padding:'6px 14px',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'6px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'13px',display:'none'}}>Pause</button>
            <button id="stopTop" style={{padding:'6px 14px',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'6px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'13px',display:'none'}}>Stop</button>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'.85rem 1.25rem',borderBottom:'1px solid rgba(128,128,128,0.3)',flexWrap:'wrap'}}>
            <button id="prevTop" style={{padding:'6px 14px',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'6px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'13px'}}>← Prev</button>
            <button id="nextTop" style={{padding:'6px 14px',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'6px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'13px'}}>Next →</button>
            <div style={{flex:1}}></div>
            <button id="copyTop" style={{fontSize:'12px',background:'none',border:'none',cursor:'pointer',textDecoration:'underline',opacity:0.6,color:'inherit'}}>Copy</button>
          </div>
          <div id="prayerBody" style={{padding:'1.25rem 1.5rem',fontSize:'1.05rem',lineHeight:1.9}}></div>
          <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'.85rem 1.25rem',borderTop:'1px solid rgba(128,128,128,0.3)',flexWrap:'wrap'}}>
            <button id="prevBot" style={{padding:'6px 14px',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'6px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'13px'}}>← Prev</button>
            <button id="nextBot" style={{padding:'6px 14px',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'6px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'13px'}}>Next →</button>
            <div style={{flex:1}}></div>
            <button id="speakBot" style={{padding:'6px 14px',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'6px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'13px'}}>Read aloud</button>
            <button id="pauseBot" style={{padding:'6px 14px',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'6px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'13px',display:'none'}}>Pause</button>
            <button id="stopBot" style={{padding:'6px 14px',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'6px',background:'transparent',color:'inherit',cursor:'pointer',fontFamily:'Georgia,serif',fontSize:'13px',display:'none'}}>Stop</button>
            <button id="copyBot" style={{fontSize:'12px',background:'none',border:'none',cursor:'pointer',textDecoration:'underline',opacity:0.6,color:'inherit'}}>Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
