'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    var lang='en',currentDay=0,novenaStart=null,userName='',speaking=false,paused=false,currentAudio=null,currentRosKey='glorious';
    var nameInput=document.getElementById('nameInput');
    nameInput.addEventListener('input',function(){updateHeader(this.value.trim());});

    function updateHeader(n){
      if(lang==='en'){document.getElementById('mainTitle').textContent=n?'Novena for '+n:'Novena for the Dead';document.getElementById('sub').textContent=n?'Nine days of prayer for the repose of the soul of '+n:'Nine days of prayer';}
      else{document.getElementById('mainTitle').textContent=n?'Novena por '+n:'Novena por los Difuntos';document.getElementById('sub').textContent=n?'Nueve días de oración por el alma de '+n:'Nueve días de oración';}
    }

    function setLang(l){
      lang=l;
      document.getElementById('btnEn').style.cssText='padding:8px 22px;border-radius:8px;cursor:pointer;font-family:Georgia,serif;font-size:14px;background:transparent;color:inherit;border:'+(l==='en'?'2px solid currentColor;font-weight:500':'1px solid rgba(128,128,128,0.5)');
      document.getElementById('btnEs').style.cssText='padding:8px 22px;border-radius:8px;cursor:pointer;font-family:Georgia,serif;font-size:14px;background:transparent;color:inherit;border:'+(l==='es'?'2px solid currentColor;font-weight:500':'1px solid rgba(128,128,128,0.5)');
      document.getElementById('lbl-for').textContent=l==='en'?'This novena is offered for':'Esta novena es ofrecida por';
      document.getElementById('lbl-day1').textContent=l==='en'?'Day 1 of 9':'Día 1 de 9';
      document.getElementById('beginBtn').textContent=l==='en'?'Begin the Novena ✝':'Comenzar la Novena ✝';
      document.getElementById('todayDisplay').textContent=fmtDate(new Date());
      updateHeader(nameInput.value.trim());
    }

    function addDays(d,n){var r=new Date(d);r.setDate(r.getDate()+n);return r;}
    function fmtDate(d){
      var DS=lang==='en'?['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']:['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      var MS=lang==='en'?['January','February','March','April','May','June','July','August','September','October','November','December']:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      return DS[d.getDay()]+', '+d.getDate()+' '+MS[d.getMonth()]+' '+d.getFullYear();
    }
    document.getElementById('todayDisplay').textContent=fmtDate(new Date());

    function beginNovena(){
      var n=nameInput.value.trim();
      if(!n){document.getElementById('errMsg').style.display='block';return;}
      document.getElementById('errMsg').style.display='none';
      userName=n;novenaStart=new Date();novenaStart.setHours(0,0,0,0);currentDay=0;
      document.getElementById('form-section').style.display='none';
      document.getElementById('novena-section').style.display='block';
      buildCal();showDay(0);
    }

    var EN={
      sign:'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
      OF:'Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.',
      HM:'Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
      GB:'Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. Amen.',
      FA:'O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to heaven, especially those in most need of Thy mercy. Amen.',
      AC:'O my God, I am heartily sorry for having offended You, and I detest all my sins because of Your just punishments, but most of all because they offend You, my God, who are all-good and deserving of all my love. I firmly resolve, with the help of Your grace, to sin no more and to avoid the near occasions of sin. Amen.',
      OFlbl:'Our Father',HMlbl:'Please pray the Hail Mary ten times.',GBlbl:'Glory Be',FAlbl:'Fatima Prayer',
      opening:'Opening Prayer',actTitle:'Act of Contrition',scripture:'Scripture Reading',meditation:'Meditation',
      intercessions:'Intercessions',lordHear:'Lord, in Your mercy, hear our prayer.',
      rosaryLbl:'The Rosary',nextMystery:'Next Mystery →',
      requiem:'Eternal Rest Prayer',deProf:'De Profundis — Psalm 130',
      deProfIntro:'A prayer from the depths, offered for the soul of',
      finalComm:'Final Commendation',closingBless:'Closing Blessing',
      finalBanner:'Final Day — Conclusion of the Novenario',
      conclusionOf:'Conclusion of the Novenario for',novenFor:'Novena for',
      ordinals:['First','Second','Third','Fourth','Fifth'],
      daysFull:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      daysShort:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
      dayLbl:'Day',ofLbl:'of',finalLbl:'Final',readAloud:'Read aloud',pause:'Pause',resume:'Resume',stop:'Stop',
      psalm:['Out of the depths I cry to You, O Lord;','Lord, hear my voice!','Let Your ears be attentive to my voice in supplication.','If You, O Lord, mark iniquities, Lord, who can stand?','But with You is forgiveness, that You may be revered.','I trust in the Lord; my soul trusts in His word.','My soul waits for the Lord more than sentinels wait for the dawn.','More than sentinels wait for the dawn, let Israel wait for the Lord,','For with the Lord is kindness and with Him is plentiful redemption;','And He will redeem Israel from all their iniquities.'],
      requiemFull:function(n){return 'Eternal rest grant unto '+n+', O Lord, and let perpetual light shine upon them. May their soul and the souls of all the faithful departed, through the mercy of God, rest in peace. Amen.';},
      requiemShort:function(n){return 'Eternal rest grant unto '+n+', O Lord, and let perpetual light shine upon them.';},
      commendation:function(n){return 'Into Your hands, O merciful Savior, we commend the soul of '+n+'. Receive them into the arms of Your mercy, into the blessed rest of everlasting peace, and into the glorious company of Your saints in light. We ask this through the intercession of the Blessed Virgin Mary, Mother of God, of Saint Joseph, patron of a happy death, and of all the angels and saints.';},
      blessing:'May the Lord bless you and keep you. May His face shine upon you and be gracious to you. May the souls of the faithful departed, through the mercy of God, rest in peace. Amen. In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
      conclusionOpen:function(n){return 'Almighty and merciful God, we have gathered for nine days to lift up the soul of '+n+' before Your throne of grace. As this novenario draws to its close, we commend '+n+' entirely into Your loving hands, trusting in Your boundless mercy and the promise of the Resurrection.';},
      conclusionInter:function(n){return 'For the soul of '+n+', that they may behold Your face in glory. For all who prayed this novena. For all the faithful departed. For the grieving, that peace guard their hearts. Amen.';},
      complete:function(n){return 'This novenario for '+n+' is now complete.';},
      grace:'May God receive your prayers with mercy and love.',
      sorrowful:{name:'Sorrowful Mysteries',list:[['The Agony in the Garden','Jesus goes to the Garden of Gethsemane to pray. He is filled with sorrow and anguish, yet He accepts the will of the Father.'],['The Scourging at the Pillar','Jesus is bound to a pillar and cruelly scourged for our sins.'],['The Crowning with Thorns','Jesus is mocked and crowned with thorns by the soldiers, bearing our shame with patience.'],['The Carrying of the Cross','Jesus carries His heavy cross to Calvary, falling three times along the way.'],['The Crucifixion and Death','Jesus is nailed to the cross and dies for the salvation of the world.']]},
      joyful:{name:'Joyful Mysteries',list:[['The Annunciation','The Angel Gabriel announces to Mary that she will conceive and bear the Son of God.'],['The Visitation','Mary visits her cousin Elizabeth, who is filled with the Holy Spirit at her greeting.'],['The Nativity','Jesus is born in Bethlehem, laid in a manger, and adored by shepherds and angels.'],['The Presentation in the Temple','Mary and Joseph present the Child Jesus in the Temple according to the Law of Moses.'],['The Finding in the Temple','After three days of searching, Mary and Joseph find Jesus in the Temple, sitting among the teachers.']]},
      glorious:{name:'Glorious Mysteries',list:[['The Resurrection','Jesus rises from the dead on the third day, triumphant over sin and death.'],['The Ascension','Jesus ascends into heaven forty days after His Resurrection, in the presence of His disciples.'],['The Descent of the Holy Spirit','The Holy Spirit descends upon Mary and the Apostles at Pentecost with tongues of fire.'],['The Assumption of Mary','At the end of her earthly life, Mary is assumed body and soul into heavenly glory.'],['The Coronation of Mary','Mary is crowned Queen of Heaven and Earth by her Divine Son.']]},
      luminous:{name:'Luminous Mysteries',list:[['The Baptism in the Jordan','Jesus is baptized by John and the Holy Spirit descends upon Him as a dove, the Father proclaiming His beloved Son.'],["The Wedding at Cana","At Mary's intercession, Jesus works His first miracle, changing water into wine."],['The Proclamation of the Kingdom','Jesus preaches repentance, forgives sins, and calls all to conversion of heart.'],['The Transfiguration','Jesus is transfigured before Peter, James, and John on Mount Tabor, revealing His divine glory.'],['The Institution of the Eucharist','At the Last Supper, Jesus gives us His Body and Blood and institutes the Holy Eucharist.']]},
      days:{
        0:{open:function(n){return 'Risen Lord Jesus, on this Sunday we lift up to You the soul of '+n+'. You conquered death so that we might live. May '+n+' share in the fullness of that victory and rise with You to eternal glory.';},scr:'"He has been raised; he is not here." — Mark 16:6',inter:function(n){return 'For the soul of '+n+', that they may share in the joy of the Resurrection. For all the faithful departed. For all who grieve. Lord in Your mercy, hear our prayer.';},ros:'glorious'},
        1:{open:function(n){return 'Heavenly Father, through the intercession of the Blessed Virgin Mary, we offer this Monday prayer for the soul of '+n+'. As Mary said yes to Your will, may '+n+' be welcomed into the joy You have prepared for those who trust in You.';},scr:'"Blessed are they who mourn, for they will be comforted." — Matthew 5:4',inter:function(n){return 'For the soul of '+n+', through the intercession of Our Lady. For all who have died. For families separated by death. Lord in Your mercy, hear our prayer.';},ros:'joyful'},
        2:{open:function(n){return 'Lord Jesus Christ, King of mercy, we pray this Tuesday for the soul of '+n+'. You suffered Your Passion for love of us. Through Your wounds, grant healing and mercy to those who have departed this life.';},scr:'"God so loved the world that he gave his only Son." — John 3:16',inter:function(n){return 'For the soul of '+n+', that they may receive Your full mercy. For all souls who suffered greatly. For those who mourn. Lord in Your mercy, hear our prayer.';},ros:'sorrowful'},
        3:{open:function(n){return 'Glorious Lord Jesus, You ascended into heaven to prepare a place for us. We pray this Wednesday for the soul of '+n+', that You receive them into those eternal mansions You promised to all who love You.';},scr:'"In my Father\'s house there are many dwelling places." — John 14:2',inter:function(n){return 'For the soul of '+n+', that they may dwell in Your house forever. For all souls longing to be purified. For our families. Lord in Your mercy, hear our prayer.';},ros:'glorious'},
        4:{open:function(n){return 'Lord Jesus, present in the Most Holy Eucharist, on this Thursday we unite our prayers to Your eternal sacrifice for the soul of '+n+'. May that same love bring '+n+' into the fullness of eternal life.';},scr:'"Whoever eats my flesh and drinks my blood has eternal life." — John 6:54',inter:function(n){return 'For the soul of '+n+', united to the Eucharistic sacrifice. For all priests who offer Mass for the dead. Lord in Your mercy, hear our prayer.';},ros:'luminous'},
        5:{open:function(n){return 'Merciful Lord Jesus, You wept over the death of Your friend Lazarus. Look with love upon the soul of '+n+'. Grant them rest from their labors and welcome them into Your eternal home.';},scr:'"I am the resurrection and the life." — John 11:25',med:function(n){return 'On this day we remember the suffering of Jesus on the Cross. Through His Passion He redeemed the world. May the soul of '+n+' be purified and brought to eternal glory.';},inter:function(n){return 'For the soul of '+n+', that they may be forgiven of all sins. For all souls in purgatory. For grieving families. Lord in Your mercy, hear our prayer.';},ros:'sorrowful'},
        6:{open:function(n){return 'Most Holy Virgin Mary, on this Saturday we bring before you the soul of '+n+'. You are the comfort of the afflicted. Present '+n+' to your Son Jesus and plead for their entry into eternal joy.';},scr:'"Even should she forget, I will never forget you." — Isaiah 49:15',inter:function(n){return 'For the soul of '+n+', through the intercession of Our Lady. For all who died today. For those in grief. Lord in Your mercy, hear our prayer.';},ros:'joyful'}
      }
    };

    var ES={
      sign:'En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.',
      OF:'Padre nuestro, que estás en el cielo, santificado sea tu nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en tentación, y líbranos del mal. Amén.',
      HM:'Dios te salve, María, llena eres de gracia; el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén.',
      GB:'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',
      FA:'Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén.',
      AC:'Dios mío, me arrepiento de todo corazón de todos mis pecados y los aborrezco, porque al pecar no sólo merezco las penas establecidas por Ti justamente, sino principalmente porque te ofendí a Ti, sumo Bien y digno de amor por encima de todas las cosas. Por eso propongo firmemente, con ayuda de tu gracia, no pecar más en adelante y huir de toda ocasión de pecado. Amén.',
      OFlbl:'Padre Nuestro',HMlbl:'Por favor recen el Ave María diez veces.',GBlbl:'Gloria',FAlbl:'Oración de Fátima',
      opening:'Oración Inicial',actTitle:'Acto de Contrición',scripture:'Lectura de la Escritura',meditation:'Meditación',
      intercessions:'Intercesiones',lordHear:'Señor, en Tu misericordia, escucha nuestra oración.',
      rosaryLbl:'El Rosario',nextMystery:'Siguiente Misterio →',
      requiem:'Oración por el Eterno Descanso',deProf:'De Profundis — Salmo 130',
      deProfIntro:'Una oración desde las profundidades, ofrecida por el alma de',
      finalComm:'Encomendación Final',closingBless:'Bendición Final',
      finalBanner:'Día Final — Conclusión del Novenario',
      conclusionOf:'Conclusión del Novenario por',novenFor:'Novena por',
      ordinals:['Primero','Segundo','Tercero','Cuarto','Quinto'],
      daysFull:['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
      daysShort:['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
      dayLbl:'Día',ofLbl:'de',finalLbl:'Final',readAloud:'Leer en voz alta',pause:'Pausa',resume:'Continuar',stop:'Detener',
      psalm:['Desde el abismo clamo a Ti, Señor;','Señor, escucha mi voz.','Estén tus oídos atentos a la voz de mi súplica.','Si llevas cuenta de los delitos, Señor, ¿quién podrá resistir?','Pero en Ti se halla el perdón, y así infundes respeto.','Yo espero en el Señor, mi alma espera, y confío en su palabra.','Mi alma aguarda al Señor más que el centinela a la aurora.','Más que el centinela a la aurora, aguarda Israel al Señor,','Porque en el Señor está la misericordia, la redención copiosa;','Él redimirá a Israel de todos sus delitos.'],
      requiemFull:function(n){return 'El descanso eterno dales, Señor, y brille para ellos la luz perpetua. Que el alma de '+n+' y las almas de todos los fieles difuntos, por la misericordia de Dios, descansen en paz. Amén.';},
      requiemShort:function(n){return 'El descanso eterno dale, Señor, a '+n+', y brille para él la luz perpetua.';},
      commendation:function(n){return 'En Tus manos, oh Salvador misericordioso, encomendamos el alma de '+n+'. Recíbela en los brazos de Tu misericordia y en la gloriosa compañía de Tus santos en la luz. Lo pedimos por intercesión de la Santísima Virgen María y de San José, patrono de la buena muerte.';},
      blessing:'Que el Señor te bendiga y te guarde. Que las almas de los fieles difuntos, por la misericordia de Dios, descansen en paz. Amén. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.',
      conclusionOpen:function(n){return 'Dios todopoderoso y misericordioso, nos hemos reunido durante nueve días para elevar el alma de '+n+' ante Tu trono de gracia. Al concluir este novenario, encomendamos a '+n+' completamente en Tus manos amorosas.';},
      conclusionInter:function(n){return 'Por el alma de '+n+', que pueda contemplar Tu rostro en la gloria. Por todos los que rezaron esta novena. Por todos los fieles difuntos. Por los afligidos, que la paz de Dios guarde sus corazones. Amén.';},
      complete:function(n){return 'Este novenario por '+n+' ha concluido.';},
      grace:'Que Dios reciba tus oraciones con misericordia y amor.',
      sorrowful:{name:'Misterios Dolorosos',list:[['La Agonía en el Huerto','Jesús va al Huerto de Getsemaní a orar. Está lleno de tristeza y angustia, pero acepta la voluntad del Padre.'],['La Flagelación','Jesús es atado a una columna y azotado cruelmente por nuestros pecados.'],['La Coronación de Espinas','Jesús es burlado y coronado con espinas por los soldados.'],['La Cruz a Cuestas','Jesús carga su pesada cruz hacia el Calvario, cayendo tres veces en el camino.'],['La Crucifixión y Muerte','Jesús es clavado en la cruz y muere por la salvación del mundo.']]},
      joyful:{name:'Misterios Gozosos',list:[['La Anunciación','El Ángel Gabriel anuncia a María que concebirá y dará a luz al Hijo de Dios.'],['La Visitación','María visita a su prima Isabel, quien se llena del Espíritu Santo.'],['El Nacimiento de Jesús','Jesús nace en Belén, es puesto en un pesebre y adorado por pastores y ángeles.'],['La Presentación en el Templo','María y José presentan al Niño Jesús en el Templo según la Ley de Moisés.'],['El Niño Jesús Perdido y Hallado','María y José encuentran a Jesús en el Templo, sentado entre los doctores.']]},
      glorious:{name:'Misterios Gloriosos',list:[['La Resurrección','Jesús resucita de entre los muertos al tercer día, triunfante sobre el pecado y la muerte.'],['La Ascensión','Jesús asciende al cielo cuarenta días después de su Resurrección.'],['La Venida del Espíritu Santo','El Espíritu Santo desciende sobre María y los Apóstoles en Pentecostés.'],['La Asunción de María','María es asunta en cuerpo y alma a la gloria celestial.'],['La Coronación de María','María es coronada Reina del Cielo y de la Tierra por su Hijo divino.']]},
      luminous:{name:'Misterios Luminosos',list:[['El Bautismo de Jesús','Jesús es bautizado por Juan y el Espíritu Santo desciende sobre Él como paloma.'],['Las Bodas de Caná','Por intercesión de María, Jesús convierte el agua en vino.'],['El Anuncio del Reino','Jesús predica la conversión y llama a todos a la conversión del corazón.'],['La Transfiguración','Jesús se transfigura ante Pedro, Santiago y Juan en el Monte Tabor.'],['La Institución de la Eucaristía','En la Última Cena, Jesús nos da su Cuerpo y su Sangre.']]},
      days:{
        0:{open:function(n){return 'Señor Jesús Resucitado, en este domingo elevamos ante Ti el alma de '+n+'. Venciste a la muerte. Que '+n+' resucite contigo a la gloria eterna.';},scr:'"Ha resucitado, no está aquí." — Marcos 16:6',inter:function(n){return 'Por el alma de '+n+', que comparta la alegría de la Resurrección. Por todos los fieles difuntos. Por los que lloran. Señor en Tu misericordia, escucha nuestra oración.';},ros:'glorious'},
        1:{open:function(n){return 'Padre Celestial, por intercesión de la Santísima Virgen María, ofrecemos esta oración del lunes por el alma de '+n+'. Que '+n+' sea acogido en la alegría que has preparado para quienes confían en Ti.';},scr:'"Bienaventurados los que lloran, porque ellos serán consolados." — Mateo 5:4',inter:function(n){return 'Por el alma de '+n+', por intercesión de Nuestra Señora. Por los que han muerto. Por las familias separadas. Señor en Tu misericordia, escucha nuestra oración.';},ros:'joyful'},
        2:{open:function(n){return 'Señor Jesucristo, Rey de misericordia, oramos este martes por el alma de '+n+'. Por Tus llagas, concede sanación y misericordia a quienes han partido de esta vida.';},scr:'"Tanto amó Dios al mundo que dio a su Hijo único." — Juan 3:16',inter:function(n){return 'Por el alma de '+n+', que reciba Tu plena misericordia. Por las almas que sufrieron. Por los que lloran. Señor en Tu misericordia, escucha nuestra oración.';},ros:'sorrowful'},
        3:{open:function(n){return 'Glorioso Señor Jesús, ascendiste al cielo para prepararnos un lugar. Rezamos este miércoles por el alma de '+n+', para que la recibas en esas mansiones eternas.';},scr:'"En la casa de mi Padre hay muchas habitaciones." — Juan 14:2',inter:function(n){return 'Por el alma de '+n+', que habite en Tu casa. Por las almas que ansían unirse a Dios. Por nuestras familias. Señor en Tu misericordia, escucha nuestra oración.';},ros:'glorious'},
        4:{open:function(n){return 'Señor Jesús, presente en la Santísima Eucaristía, en este jueves unimos nuestras oraciones por el alma de '+n+'. Que ese amor lleve a '+n+' a la plenitud de la vida eterna.';},scr:'"El que come mi carne y bebe mi sangre tiene vida eterna." — Juan 6:54',inter:function(n){return 'Por el alma de '+n+', unida al sacrificio eucarístico. Por los sacerdotes que ofrecen Misa. Señor en Tu misericordia, escucha nuestra oración.';},ros:'luminous'},
        5:{open:function(n){return 'Misericordioso Señor Jesús, lloraste por la muerte de Lázaro. Mira con amor el alma de '+n+'. Concédele descanso y recíbela en Tu hogar eterno.';},scr:'"Yo soy la resurrección y la vida." — Juan 11:25',med:function(n){return 'Recordamos el sufrimiento de Jesús en la Cruz. Por Su Pasión redimió el mundo. Que el alma de '+n+' sea purificada y llevada a la gloria eterna.';},inter:function(n){return 'Por el alma de '+n+', que sea perdonada. Por las almas del purgatorio. Por los familiares en duelo. Señor en Tu misericordia, escucha nuestra oración.';},ros:'sorrowful'},
        6:{open:function(n){return 'Santísima Virgen María, en este sábado traemos ante ti el alma de '+n+'. Eres el consuelo de los afligidos. Presenta a '+n+' a tu Hijo Jesús e intercede por su entrada en la alegría eterna.';},scr:'"Aunque ella se olvidara, yo no te olvidaré." — Isaías 49:15',inter:function(n){return 'Por el alma de '+n+', por la intercesión de Nuestra Señora. Por los que murieron hoy. Por los que están de duelo. Señor en Tu misericordia, escucha nuestra oración.';},ros:'joyful'}
      }
    };

    function L(){return lang==='en'?EN:ES;}


    function getOpeningText(dow,n){
      var l=L(),dp=l.days[dow];
      var t=l.opening+". "+l.sign+" "+dp.open(n)+" "+l.scripture+". "+dp.scr;
      if(dp.med)t+=" "+l.meditation+". "+dp.med(n);
      t+=" "+l.actTitle+". "+l.AC+" "+l.intercessions+". "+l.lordHear+" "+dp.inter(n);
      return t;
    }   function getMysteryText(rosKey,idx){
  var l=L(),m=l[rosKey];
  var title=m.list[idx][0],desc=m.list[idx][1];
  var ord=l.ordinals[idx],rosWord=lang==='en'?m.name.split(' ')[0]:m.name.split(' ')[1]||m.name.split(' ')[0];
  return ord+' '+rosWord+': '+title+'. '+desc+' '+l.OFlbl+': '+l.OF+' '+l.HMlbl+': '+Array(10).fill(l.HM).join(' ')+' '+l.GBlbl+': '+l.GB+' '+l.FAlbl+': '+l.FA;
}

    function getMysteryText(rosKey,idx){
      var l=L(),m=l[rosKey];
      var title=m.list[idx][0],desc=m.list[idx][1];
      var ord=l.ordinals[idx],rosWord=lang==='en'?m.name.split(' ')[0]:m.name.split(' ')[1]||m.name.split(' ')[0];
      return ord+' '+rosWord+': '+title+'. '+desc+' '+l.OFlbl+': '+l.OF+' '+l.HMlbl+': '+Array(10).fill(l.HM).join(' ')+' '+l.GBlbl+': '+l.GB+' '+l.FAlbl+': '+l.FA;
    }

    function getConclusionText(n){
      var l=L();
      return l.sign+' '+l.conclusionOpen(n)+' '+l.requiemFull(n)+' '+l.psalm.join(' ')+' '+l.requiemShort(n)+' '+l.commendation(n)+' '+l.conclusionInter(n)+' '+l.blessing;
    }

    function mBlock(rosKey,idx){
      var l=L(),m=l[rosKey],ord=l.ordinals[idx];
      var title=m.list[idx][0],desc=m.list[idx][1];
      var rosWord=lang==='en'?m.name.split(' ')[0]:m.name.split(' ')[1]||m.name.split(' ')[0];
      return '<div id="mystery-'+idx+'" style="margin:1rem 0;padding:1rem 1.25rem;border:1px solid rgba(128,128,128,0.2);border-radius:8px;">'
        +'<p style="font-family:Georgia,serif;font-size:1.05rem;font-weight:500;margin-bottom:.4rem;">'+ord+' '+rosWord+': '+title+'</p>'
        +'<p style="font-size:.95rem;opacity:0.7;font-style:italic;margin-bottom:.75rem;line-height:1.7;">'+desc+'</p>'
        +'<p style="font-size:1rem;font-weight:500;margin-bottom:.4rem;">'+l.OFlbl+'</p>'
        +'<p style="margin-bottom:.6rem;line-height:1.8;">'+l.OF+'</p>'
        +'<p style="font-size:.95rem;opacity:0.7;font-style:italic;margin:.4rem 0;padding:.5rem;border:1px dashed rgba(128,128,128,0.3);border-radius:6px;">🙏 '+l.HMlbl+'</p>'
        +'<p style="font-size:1rem;font-weight:500;margin:.6rem 0 .4rem;">'+l.GBlbl+'</p>'
        +'<p style="margin-bottom:.6rem;line-height:1.8;">'+l.GB+'</p>'
        +'<p style="font-size:1rem;font-weight:500;margin:.6rem 0 .4rem;">'+l.FAlbl+'</p>'
        +'<p style="line-height:1.8;">'+l.FA+'</p>'
        +(idx<4?'<div style="display:flex;gap:8px;margin-top:1rem;flex-wrap:wrap;">'
  +'<button id="nxt-'+idx+'" style="padding:7px 16px;border:1px solid rgba(128,128,128,0.5);border-radius:6px;background:transparent;color:inherit;cursor:pointer;font-family:Georgia,serif;font-size:13px;">'+l.nextMystery+'</button>'
  +'<button id="mpause-'+idx+'" style="padding:7px 16px;border:1px solid rgba(128,128,128,0.5);border-radius:6px;background:transparent;color:inherit;cursor:pointer;font-family:Georgia,serif;font-size:13px;display:none;">'+l.pause+'</button>'
  +'<button id="mstop-'+idx+'" style="padding:7px 16px;border:1px solid rgba(128,128,128,0.5);border-radius:6px;background:transparent;color:inherit;cursor:pointer;font-family:Georgia,serif;font-size:13px;display:none;">'+l.stop+'</button>'
  +'</div>':'')
        +'</div>';
    }

    function rosaryHtml(rosKey){
      var l=L(),m=l[rosKey],h='';
      h+='<p style="font-family:Georgia,serif;font-size:1.1rem;font-weight:500;margin:1.5rem 0 .4rem;">'+l.rosaryLbl+' — '+m.name+'</p>';
      for(var i=0;i<5;i++)h+=mBlock(rosKey,i);
      return h;
    }

    function sT(t){return '<p style="font-family:Georgia,serif;font-size:1.1rem;font-weight:500;margin:1.5rem 0 .4rem;">'+t+'</p>';}
    function sP(t){return '<p style="margin-bottom:.75rem;line-height:1.9;">'+t+'</p>';}
    function sSc(t){return '<blockquote style="border-left:2px solid rgba(128,128,128,0.4);padding-left:1rem;margin:.5rem 0 .75rem;font-style:italic;font-size:1rem;line-height:1.8;opacity:0.85;">'+t+'</blockquote>';}
    function sLi(arr){return '<ul style="list-style:none;padding:0;margin:.5rem 0 .75rem;">'+arr.map(function(i){return '<li style="padding-left:1.2rem;position:relative;line-height:1.8;margin-bottom:.2rem;"><span style="position:absolute;left:0;font-size:.6rem;top:.5rem;opacity:0.5;">✦</span>'+i+'</li>';}).join('')+'</ul>';}

    function buildDay(dow,n){
      var l=L(),dp=l.days[dow],h='';
      currentRosKey=dp.ros;
      h+=sT(l.opening)+sP(l.sign)+sP(dp.open(n));
      h+=sT(l.scripture)+sSc(dp.scr);
      if(dp.med){h+=sT(l.meditation);h+=sP(dp.med(n));}
      h+=sT(l.actTitle)+sP(l.AC);
      h+=sT(l.intercessions)+sP(l.lordHear)+sP(dp.inter(n));
      h+=rosaryHtml(dp.ros);
      return h;
    }

    function buildConclusion(n){
      var l=L(),h='';
      h+=sT(l.opening)+sP(l.sign)+sP(l.conclusionOpen(n));
      h+=sT(l.requiem)+sP(l.requiemFull(n));
      h+=sT(l.deProf)+'<p style="font-style:italic;font-size:.9rem;opacity:0.6;margin-bottom:.5rem;">'+l.deProfIntro+' '+n+'.</p>';
      l.psalm.forEach(function(v){h+='<p style="padding-left:1.5rem;line-height:1.9;margin-bottom:.3rem;">'+v+'</p>';});
      h+='<p style="margin-top:.75rem;margin-bottom:.75rem;line-height:1.9;">'+l.requiemShort(n)+'</p>';
      h+=sT(l.finalComm)+sP(l.commendation(n));
      h+=sT(l.intercessions)+sP(l.conclusionInter(n));
      h+=sT(l.closingBless)+sP(l.blessing);
      h+='<div style="text-align:center;margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid rgba(128,128,128,0.3);"><span style="font-size:20px;opacity:0.5;display:block;margin-bottom:.35rem;">✝</span><p style="font-family:Georgia,serif;font-size:1rem;font-style:italic;opacity:0.6;">'+l.complete(n)+'<br>'+l.grace+'</p></div>';
      return h;
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
        })(i);
      }
    }

    function buildCal(){
      var g=document.getElementById('cal-grid'),l=L();g.innerHTML='';
      for(var i=0;i<9;i++){
        var d=addDays(novenaStart,i),fin=i===8;
        var el=document.createElement('div');
        el.style.cssText='text-align:center;padding:7px 3px;border:1px solid rgba(128,128,128,0.3);border-radius:7px;cursor:pointer;'+(fin?'border-style:dashed;':'');
        el.innerHTML='<div style="font-size:10px;opacity:0.6;">'+l.daysShort[d.getDay()]+'</div><div style="font-size:13px;font-weight:500;">'+d.getDate()+'</div><div style="font-size:9px;opacity:0.6;">'+(fin?l.finalLbl:l.dayLbl+' '+(i+1))+'</div>';
        el.id='calDay'+i;
        (function(idx){el.addEventListener('click',function(){goTo(idx);});})(i);
        g.appendChild(el);
      }
    }

    function showDay(idx){
      stopSpeak();currentDay=idx;
      for(var i=0;i<9;i++){var el=document.getElementById('calDay'+i);if(el)el.style.outline=i===idx?'2px solid currentColor':'none';}
      var d=addDays(novenaStart,idx),fin=idx===8,l=L(),dow=d.getDay();
      document.getElementById('final-banner').style.display=fin?'block':'none';
      document.getElementById('final-banner').textContent=l.finalBanner;
      document.getElementById('dayLabel').textContent=l.dayLbl+' '+(idx+1)+' '+l.ofLbl+' 9 — l.ordinals[idx] is wrong — '+['First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth'][idx];
      document.getElementById('dayDate').textContent=fmtDate(d);
      document.getElementById('prevTop').disabled=idx===0;document.getElementById('prevBot').disabled=idx===0;
      document.getElementById('nextTop').disabled=idx===8;document.getElementById('nextBot').disabled=idx===8;
      document.getElementById('speakTop').textContent=l.readAloud;
      document.getElementById('speakBot').textContent=l.readAloud;
      if(fin){
        document.getElementById('dayHeading').textContent=l.conclusionOf+' '+userName;
        document.getElementById('prayerBody').innerHTML=buildConclusion(userName);
      } else {
        document.getElementById('dayHeading').textContent=l.novenFor+' '+userName+' — '+l.daysFull[dow];
        document.getElementById('prayerBody').innerHTML=buildDay(dow,userName);
        attachMysteryButtons();
      }
    }

    function changeDay(dir){var n=currentDay+dir;if(n<0||n>8)return;goTo(n);}
    function goTo(idx){stopSpeak();showDay(idx);}


    async function playFixed(fixedKey){
      var res=await fetch("/api/speak",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fixedKey:fixedKey,language:lang,text:""})});
      if(!res.ok)throw new Error("failed");
      var blob=await res.blob();
      var url=URL.createObjectURL(blob);
      return new Promise(function(resolve,reject){
        currentAudio=new Audio(url);
        currentAudio.onended=resolve;
        currentAudio.onerror=reject;
        currentAudio.play();
      });
    }

    async function getMysteryIntroText(rosKey,idx){
      var l=L(),m=l[rosKey];
      var title=m.list[idx][0],desc=m.list[idx][1];
      var ord=l.ordinals[idx],rosWord=lang==="en"?m.name.split(" ")[0]:m.name.split(" ")[1]||m.name.split(" ")[0];
      return ord+" "+rosWord+": "+title+". "+desc+" "+l.OFlbl+": "+l.OF;
    }

    async function speakMysteryInParts(rosKey,idx){
      speaking=true;paused=false;updateSpeakUI();
      try{
        var introText=await getMysteryIntroText(rosKey,idx);
        var cacheKey="mystery-intro-"+rosKey+"-"+idx;
        await speakOne(introText,cacheKey);
        if(!speaking)return;
        await playFixed("HM5");
        if(!speaking)return;
        await playFixed("HM5");
        if(!speaking)return;
        await playFixed("GB");
        if(!speaking)return;
        await playFixed("FA");
      }catch(e){console.error(e);}
      speaking=false;paused=false;updateSpeakUI();
    }    async function speakOne(text,cacheKey){
      speaking=true;paused=false;updateSpeakUI();
      try{
        var res=await fetch('/api/speak',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text.slice(0,2000),language:lang,cacheKey:cacheKey})});
        if(!res.ok)throw new Error('failed');
        var blob=await res.blob();
        var url=URL.createObjectURL(blob);
        currentAudio=new Audio(url);
        currentAudio.onended=function(){speaking=false;paused=false;updateSpeakUI();};
        currentAudio.onerror=function(){speaking=false;paused=false;updateSpeakUI();};
        currentAudio.play();
      }catch(e){console.error(e);speaking=false;updateSpeakUI();}
    }

    async function toggleSpeak(){
      if(speaking){stopSpeak();return;}
      var d=addDays(novenaStart,currentDay),fin=currentDay===8,dow=d.getDay();
      var text=fin?getConclusionText(userName):getOpeningText(dow,userName)+' '+getMysteryText(currentRosKey,0);
      var cacheKey=fin?null:'opening-day'+dow+'-mystery0-'+currentRosKey;
      await speakOne(text,cacheKey);
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
    document.getElementById('beginBtn').addEventListener('click',beginNovena);
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
        <p id="lbl-for" style={{fontSize:'11px',letterSpacing:'.05em',textTransform:'uppercase',opacity:0.6,marginBottom:'6px'}}>This novena is offered for</p>
        <input id="nameInput" type="text" placeholder="e.g. Maria Santos"
          style={{width:'100%',padding:'10px 14px',fontSize:'16px',fontFamily:'Georgia,serif',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'8px',background:'transparent',color:'inherit',display:'block',marginBottom:'1.25rem',boxSizing:'border-box'}} />
        <p style={{fontSize:'11px',letterSpacing:'.05em',textTransform:'uppercase',opacity:0.6,marginBottom:'6px'}}>Starting today</p>
        <div style={{padding:'10px 14px',border:'1px solid rgba(128,128,128,0.3)',borderRadius:'8px',fontSize:'14px',opacity:0.7,marginBottom:'1.5rem',display:'flex',justifyContent:'space-between'}}>
          <span id="todayDisplay"></span>
          <span id="lbl-day1" style={{fontSize:'12px'}}>Day 1 of 9</span>
        </div>
        <p id="errMsg" style={{color:'red',fontSize:'13px',marginBottom:'8px',display:'none'}}>Please enter a name first.</p>
        <button id="beginBtn" style={{width:'100%',padding:'13px',fontSize:'1.05rem',fontFamily:'Georgia,serif',border:'1px solid rgba(128,128,128,0.5)',borderRadius:'8px',background:'transparent',color:'inherit',cursor:'pointer'}}>Begin the Novena ✝</button>
      </div>
      <div id="novena-section" style={{display:'none'}}>
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