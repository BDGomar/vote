import pandas as pd
import mysql.connector
from mysql.connector import Error
import os

def import_excel_to_mysql(excel_file_path, db_config):
    """
    Importe les données d'un fichier Excel vers la table MySQL vote.etudiants
    """
    try:
        # Lire toutes les feuilles du fichier Excel
        xl = pd.ExcelFile(excel_file_path)
        all_data = []
        
        print(f"Lecture du fichier Excel: {excel_file_path}")
        print(f"Feuilles trouvées: {xl.sheet_names}")
        
        # Parcourir toutes les feuilles
        for sheet_name in xl.sheet_names:
            print(f"Traitement de la feuille: {sheet_name}")
            
            # Lire la feuille
            df = pd.read_excel(excel_file_path, sheet_name=sheet_name)
            
            # Vérifier que les colonnes attendues existent
            required_columns = ['Matricule', 'Nom', 'Prenom', 'Filière', 'Niveau']
            if not all(col in df.columns for col in required_columns):
                print(f"Attention: Colonnes manquantes dans la feuille {sheet_name}")
                continue
            
            # Nettoyer et formater les données
            for _, row in df.iterrows():
                # Formater la filière (abréviation)
                filiere = row['Filière'].strip().upper()
                if 'INFORMATIQUE DE GESTION' in filiere:
                    filiere_abbr = 'IG'
                elif 'RESEAUX TELECOMMUNICATIONS' in filiere:
                    filiere_abbr = 'RT'
                elif 'BACHELOR IN BUSINESS ADMINISTRATION' in filiere:
                    filiere_abbr = 'BBA'
                elif 'DROIT' in filiere:
                    filiere_abbr = 'DROIT'
                elif 'SCIENCES ECONOMIQUES ET DE GESTION' in filiere:
                    filiere_abbr = 'SEG'
                elif 'COMMUNICATION' in filiere:
                    filiere_abbr = 'COM'
                elif 'MANAGEMENT DES RESSOURCES HUMAINES' in filiere:
                    filiere_abbr = 'MRH'
                elif 'MARKETING' in filiere:
                    filiere_abbr = 'MKT'
                elif 'BANQUE FINANCE' in filiere:
                    filiere_abbr = 'BQ'
                elif 'TRANSPORT LOGISTIQUE' in filiere:
                    filiere_abbr = 'TL'
                elif 'FINANCE COMPTABILITE' in filiere or 'ECONOMIE-FISCALITE-FINANCE' in filiere:
                    filiere_abbr = 'FC'
                elif 'SCIENCES BIOMEDICALES' in filiere:
                    filiere_abbr = 'SBIO'
                elif 'GENIE CIVIL' in filiere:
                    filiere_abbr = 'GC'
                elif 'MANAGEMENT DE PROJET' in filiere:
                    filiere_abbr = 'PROJET'
                else:
                    filiere_abbr = filiere[:2]  # Prendre les 2 premières lettres par défaut
                
                # Préparer l'enregistrement
                etudiant = {
                    'matricule': str(int(row['Matricule'])),
                    'nom': str(row['Nom']).strip().upper(),
                    'prenom': str(row['Prenom']).strip(),
                    'filiere': filiere_abbr,
                    'niveau': str(int(row['Niveau'])),
                    'created_at': 'NOW()',
                    'updated_at': 'NOW()'
                }
                all_data.append(etudiant)
        
        print(f"Nombre total d'étudiants à importer: {len(all_data)}")
        
        # Connexion à la base de données MySQL
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        
        # Requête d'insertion
        insert_query = """
        INSERT INTO vote.etudiants 
        (matricule, nom, prenom, filiere, niveau, created_at, updated_at) 
        VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
        """
        
        # Préparer les données pour l'insertion
        data_to_insert = [
            (etudiant['matricule'], etudiant['nom'], etudiant['prenom'], 
             etudiant['filiere'], etudiant['niveau'])
            for etudiant in all_data
        ]
        
        # Exécuter l'insertion
        cursor.executemany(insert_query, data_to_insert)
        connection.commit()
        
        print(f"✅ {cursor.rowcount} étudiants insérés avec succès dans la base de données!")
        
    except Error as e:
        print(f"❌ Erreur MySQL: {e}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

# Configuration de la base de données
db_config = {
    'host': 'localhost',
    'database': 'vote',
    'user': 'root',
    'password': 'Idrissaben12',
    'port': 3306
}

# Chemin vers votre fichier Excel
excel_file_path = '/Users/omar/Downloads/Feuille de calcul sans titre-2.xlsx'

# Exécuter l'importation
if __name__ == "__main__":
    if os.path.exists(excel_file_path):
        import_excel_to_mysql(excel_file_path, db_config)
    else:
        print(f"❌ Fichier Excel non trouvé: {excel_file_path}")
