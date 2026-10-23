/*
 * CASA MIGA · datos del negocio
 *
 * Edita sólo este archivo para publicar los datos reales. Mientras un campo esté vacío (''),
 * la web muestra el valor de ejemplo marcado como "Ejemplo" y no crea enlaces que no lleven a ningún sitio.
 * Cuando dirección, teléfono y horario estén completos, la página añade los datos estructurados
 * (schema.org CafeOrCoffeeShop) para buscadores.
 */
window.CASA_MIGA = {
  // Dirección postal completa, p. ej. 'Calle de la Panadería 12, 46001 Valencia'
  address: '',

  // Horario, una fila por tramo: ['Días', 'Horas', 'Formato para buscadores'].
  // El tercer valor sigue schema.org (Mo Tu We Th Fr Sa Su) y es opcional.
  // p. ej. [['Lunes a viernes', '08:00–20:00', 'Mo-Fr 08:00-20:00'], ['Sábados y domingos', '09:00–14:00', 'Sa-Su 09:00-14:00']]
  hours: [],

  // Teléfono en formato internacional, p. ej. '+34 960 000 000'
  phone: '',

  // Correo de contacto
  email: '',

  // Usuario de Instagram sin @, p. ej. 'casamiga'
  instagram: '',

  // Enlace de Google Maps a la ficha del local (Compartir > Copiar enlace)
  mapsUrl: '',

  // URL pública de la web, p. ej. 'https://casamiga.es/' (para datos estructurados)
  siteUrl: ''
};
