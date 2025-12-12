# 🎮 Historias de Elección - Interactive Story Game

> **Elige tu camino. Enfrenta las consecuencias. Sobrevive... si puedes.**

Un juego narrativo interactivo donde cada decisión importa. Inspirado en los clásicos libros de "Elige tu propia aventura", este proyecto combina storytelling inmersivo con tecnología moderna para crear experiencias únicas cada vez que juegas.

## 📖 Sobre el Proyecto

**Historias de Elección** es una plataforma web de narrativa interactiva que te sumerge en tres mundos peligrosos y fascinantes. Cada historia está cuidadosamente diseñada con múltiples caminos, decisiones difíciles y consecuencias reales. No hay dos partidas iguales.

Lo que hace especial a este proyecto:
- **Narrativa profunda**: Historias escritas con múltiples actos, personajes complejos y giros argumentales inesperados
- **Imágenes generadas por IA**: Cada escena se visualiza con ilustraciones únicas creadas en tiempo real
- **Dificultad variable**: Desde historias accesibles hasta desafíos mortales donde solo 1 de cada 3 decisiones te mantiene con vida
- **Sin instalación**: Juega directamente desde tu navegador

## 🌟 Las Tres Historias

### 🌊 La Bóveda Hundida
**Dificultad: MORTAL** 🔴

Despiertas en un submarino dañado a 3.000 metros de profundidad. El oxígeno se agota, el casco se agrieta bajo la presión abisal, y cada decisión podría ser tu última. Debes encontrar las cápsulas de escape antes de que el océano te reclame.

*Temática: Sci-Fi submarino, supervivencia extrema*  
*Finales posibles: 8 (solo 3 son victorias)*

### 🚀 La Estación Silenciosa
**Dificultad: DIFÍCIL** 🟠

Una señal de socorro te lleva a una estación minera en asteroides. Debería haber 127 personas... pero solo encuentras silencio, sangre y huevos alienígenas. ¿Investigarás qué pasó o huirás mientras puedas?

*Temática: Horror espacial, infección alienígena*  
*Finales posibles: 12 (4 son victorias)*

### 🌲 El Bosque de los Susurros
**Dificultad: NORMAL** 🟢

Te perdiste en el bosque prohibido buscando hierbas para tu hermana enferma. Los árboles susurran en idiomas antiguos, las sirenas cantan en ríos encantados, y una bruja te ofrece hospitalidad... ¿Encontrarás la salida antes del amanecer?

*Temática: Fantasía oscura, folklore*  
*Finales posibles: 10 (3 son victorias)*

## ✨ Características

### 🎨 Visualización Dinámica
Cada escena genera automáticamente una ilustración única usando IA (Pollinations.ai). Las imágenes se adaptan al contexto narrativo, creando una experiencia visual inmersiva que cambia en cada partida.

### 🎯 Sistema de Decisiones
- **Tres opciones por escena**: Cada decisión importa
- **Consecuencias reales**: Tus elecciones afectan la historia de forma permanente
- **Múltiples finales**: Victoria, derrota, sacrificio heroico, supervivencia egoísta...
- **Pistas sutiles**: Lee con atención, los detalles pueden salvarte la vida

### 🎭 Niveles de Dificultad
- **NORMAL** 🟢: ~30% de decisiones correctas
- **DIFÍCIL** 🟠: ~20% de decisiones correctas  
- **MORTAL** 🔴: ~15% de decisiones correctas (solo para valientes)

### 📱 Diseño Responsivo
Interfaz oscura y atmosférica que funciona perfectamente en:
- 💻 Escritorio
- 📱 Móviles
- 📲 Tablets

### ⚡ Rendimiento Optimizado
- Sin frameworks pesados en el frontend
- Carga rápida de historias
- Generación de imágenes en segundo plano
- Arquitectura ligera y eficiente

## 🛠️ Tecnologías

**Backend:**
- Node.js
- Express.js
- Sistema de rutas modular

**Frontend:**
- HTML5 semántico
- CSS3 (Flexbox/Grid, animaciones)
- Vanilla JavaScript (sin dependencias)

**IA & Assets:**
- Pollinations.ai para generación de imágenes
- Prompts contextuales dinámicos

**Arquitectura:**
- Historias en formato JSON modular
- Separación de lógica y contenido
- Fácil de extender con nuevas historias

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js (v14 o superior)
- npm o yarn

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/javierarteagapuell/escape_room.git
cd escape_room

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Abrir en tu navegador
# http://localhost:3000
```

### Scripts Disponibles

```bash
npm run dev    # Inicia el servidor en modo desarrollo
npm start      # Inicia el servidor en modo producción
```

## 📂 Estructura del Proyecto

```
escape_room/
├── data/
│   └── stories/          # Historias en formato JSON
│       ├── deep_sea.json
│       ├── space_station.json
│       └── haunted_forest.json
├── public/
│   ├── index.html        # Página principal
│   ├── style.css         # Estilos globales
│   └── app.js            # Lógica del cliente
├── routes/
│   └── stories.js        # API de historias
├── services/
│   └── storyService.js   # Lógica de negocio
├── server.js             # Servidor Express
└── package.json
```

## 🎮 Cómo Jugar

1. **Selecciona una historia** en la pantalla principal
2. **Lee cuidadosamente** cada escena - los detalles importan
3. **Elige una de las tres opciones** disponibles
4. **Enfrenta las consecuencias** de tus decisiones
5. **Intenta sobrevivir** hasta alcanzar un final

**Consejo:** No siempre la opción más obvia es la correcta. Presta atención a las pistas sutiles en el texto.

## 🤝 Contribuir

¿Tienes ideas para nuevas historias o mejoras? ¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-historia`)
3. Commit tus cambios (`git commit -m 'Añadir nueva historia: El Castillo Maldito'`)
4. Push a la rama (`git push origin feature/nueva-historia`)
5. Abre un Pull Request

## 📝 Crear Tu Propia Historia

Las historias se definen en archivos JSON. Estructura básica:

```json
{
  "id": "mi_historia",
  "title": "Mi Historia Épica",
  "theme": "palabras clave para IA",
  "difficulty": "NORMAL",
  "description": "Descripción corta",
  "start_node": "intro",
  "nodes": {
    "intro": {
      "text": "Texto de la escena...",
      "choices": [
        {"text": "Opción 1", "next": "nodo_siguiente"},
        {"text": "Opción 2", "next": "otro_nodo"}
      ]
    }
  }
}
```

## 📜 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

**Javier Arteaga Puell**
- GitHub: [@javierarteagapuell](https://github.com/javierarteagapuell)

## 🙏 Agradecimientos

- Inspirado en los libros clásicos de "Elige tu propia aventura"
- Imágenes generadas por [Pollinations.ai](https://pollinations.ai)
- A todos los jugadores que se atreven a enfrentar las historias más difíciles

---

⭐ Si te gusta el proyecto, ¡dale una estrella en GitHub!

🎮 **¿Listo para jugar?** Elige tu historia y que la suerte te acompañe...
