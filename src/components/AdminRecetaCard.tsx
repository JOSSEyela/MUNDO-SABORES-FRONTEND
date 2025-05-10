import React from 'react';
import styles from '../pages/admin/Dashboard/Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

interface AdminRecetaCardProps {
    receta: any;
    modo: 'pendiente' | 'aprobada';
    onAprobar?: (id: number) => void;
    onEliminar: (id: number) => void;
}

const AdminRecetaCard: React.FC<AdminRecetaCardProps> = ({
    receta,
    modo,
    onAprobar,
    onEliminar,
}) => {
    const navigate = useNavigate();

    return (
        <div className={styles.recetaCard}>
            <h3>{receta.title}</h3>
            <p><strong>Usuario:</strong> {receta.usuario?.username}</p>
            <p><strong>Categoría:</strong> {receta.categoria?.nombre}</p>
            <p>{receta.description?.slice(0, 100)}...</p>

            <div className={styles.cardActions}>
                {modo === 'pendiente' && onAprobar && (
                    <button
                        className={styles.editButton}
                        onClick={() => onAprobar(receta.id)}
                    >
                        ✅ Aprobar
                    </button>
                )}
                {modo === 'aprobada' && (
                    <button
                        className={styles.editButton}
                        onClick={() => navigate(`/editar/${receta.id}`)}
                    >
                        ✏️ Editar
                    </button>
                )}
                <button
                    className={styles.deleteButton}
                    onClick={() => onEliminar(receta.id)}
                >
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    );
};

export default AdminRecetaCard;
