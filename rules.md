# Reglas del Sistema "El Susurro del Abismo"

## Acciones Válidas
El jugador puede interactuar con el entorno usando lenguaje natural. Las acciones reconocidas incluyen (pero no se limitan a):
- **Mirar / Examinar [Objeto/Lugar]**: Para obtener descripciones detalladas o pistas.
- **Coger / Tomar [Objeto]**: Para añadir al inventario.
- **Usar [Objeto] en [Objetivo]**: Para interactuar (ej. llave en cerradura).
- **Combinar [Objeto A] con [Objeto B]**: Para crear nuevos objetos.
- **Abrir / Cerrar [Objeto]**: Contenedores, puertas, etc.
- **Hablar con [NPC]**: Para obtener información.
- **Golpear / Mover / Empujar**: Interacciones físicas variadas.
- **Esperar**: Pasa el tiempo (útil para eventos temporales).

## Formato de Respuesta de la IA
Cada turno, la IA consultará el estado actual y responderá en JSON (interpretado internamente) o texto formateado para el usuario:
1. **Narrativa**: Descripción inmersiva del resultado.
2. **Resultado**: Éxito / Fallo / Neutral.
3. **Estado**: Cambios en el mundo (inventario, variables).
4. **Pistas**: Si la acción revela algo nuevo.
5. **Sugerencias**: 2-3 opciones lógicas para continuar.

## Sistema de Pistas
- Las pistas se revelan gradualmente. Si el jugador pide ayuda directa ("pista"), se le preguntará confirmación.
- Niveles: Pista vaga -> Pista direccional -> Solución parcial.

## Manejo de Errores
- Si el jugador intenta algo imposible ("volar"), la IA responderá narrativamente explicando por qué falla y sugerirá acciones alternativas sensatas.
