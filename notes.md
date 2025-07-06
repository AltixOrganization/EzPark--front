PUT /api/reviews/{id}

Actualiza una reseña existente.

Path Parameters:

id (Long): ID de la reseña a actualizar
Request Body:


{
  "rating": 4,
  "comment": "Actualizado: Buen lugar para estacionar"
}


Response: 200 OK
{
  "id": 1,
  "rating": 4,
  "comment": "Actualizado: Buen lugar para estacionar",
  "parkingId": 1,
  "profileId": 1,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T12:00:00"
}

4. Eliminar una reseña
DELETE /api/reviews/{id}

Elimina una reseña del sistema.

Path Parameters:

id (Long): ID de la reseña a eliminar
Response: 204 No Content