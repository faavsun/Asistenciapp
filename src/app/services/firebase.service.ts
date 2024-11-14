import { inject, Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,sendPasswordResetEmail,updatePassword} from 'firebase/auth'
import { User } from '../models/user.model';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {getFirestore,setDoc,doc, getDoc, collectionData, getDocs,collection,Firestore} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { Seccion } from '../models/seccion.model';
import { Asignatura } from '../models/asignatura.model';
import { AlumnoSeccion } from '../models/alumnoseccion.model';
import { Observable, switchMap, forkJoin, combineLatest, map } from 'rxjs';
import { Asistencia } from '../models/asistencia.model';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);

 asignaturas: { id: string; nombre: string; profesor: string }[] = [];
  seccionesPorAsignatura: { [key: string]: any[] } = {}; // Cambia el tipo según tu necesidad
//==================== Autentificacion=========================




//============ proteger rutas=========
getAuth(){
  return getAuth();
}


//=========Acceder==========
signIn(user: User){
  return signInWithEmailAndPassword(getAuth(),user.email,user.password)
  .then((userCredential) => {
    // Almacena el UID del usuario en el almacenamiento local
    localStorage.setItem('userUid', userCredential.user.uid);
    return userCredential;
  });
}

//=========Crear==========
signUp(user: User){
  return createUserWithEmailAndPassword(getAuth(),user.email,user.password)
}

//=========Actualizar==========
updateUser(displayName: string){
  return updateProfile(getAuth().currentUser, {displayName})
}

//================== actualizar password=========

  // Método para cambiar la contraseña
  async updatePassword(newPassword: string): Promise<void> {
    if (!newPassword || newPassword.trim() === '') {
      this.utilsSvc.showToast("La nueva contraseña no puede estar vacía."); // Notificación de advertencia
      throw new Error("La nueva contraseña no puede estar vacía.");
    }
  
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    
    if (user) {
      try {
        await updatePassword(user, newPassword);
        console.log("Contraseña actualizada exitosamente");
        this.utilsSvc.showToast("Contraseña actualizada exitosamente"); // Notificación de éxito
      } catch (error: any) {
        if (error.code === 'auth/requires-recent-login') {
          console.error("La sesión ha expirado. Se requiere reautenticación.", error);
          throw new Error("La sesión ha expirado. Por favor, vuelve a iniciar sesión para cambiar tu contraseña.");
        } else {
          console.error("Error al cambiar la contraseña", error);
          throw new Error("Ocurrió un error al cambiar la contraseña. Inténtalo nuevamente.");
        }
      }
    } else {
      throw new Error("No hay usuario autenticado.");
    }
  }




//========== enviar email para restablecer============
sendRecoveryEmail(email: string){
  return sendPasswordResetEmail(getAuth(),email);
}






//========== Cerrar sesión===============
signOut() {
  getAuth().signOut().then(() => {
    localStorage.removeItem('user'); // Asegúrate de que este sea el nombre correcto
    localStorage.removeItem('userUid'); // Elimina el UID del usuario
    this.resetUserData(); // Resetea datos del usuario
    this.utilsSvc.routerLink('/login');
  });
}

resetUserData() {
  // Lógica para reiniciar cualquier dato que dependa del usuario
  this.asignaturas = []; // Suponiendo que tienes un atributo asignaturas en el servicio
  this.seccionesPorAsignatura = {}; // Suponiendo que tienes un objeto para las secciones
}







//============================== Base de datos=================

//=== setear un documento==========
setDocument(path: string,data: any){
  return setDoc(doc(getFirestore(),path),data);

}

//=== Obtener un documento==========
async getDocument(path: string){
  return (await getDoc(doc(getFirestore(),path))).data();

}

//================================ Yo datos de asig

  // Nuevo método para obtener todos los documentos de una colección
  async getAllDocuments(): Promise<{ id: string; nombre: string; profesor: string  }[]> {
    const snapshot = await this.firestore.collection('asignatura').get().toPromise();
    return snapshot.docs.map(doc => {
      const data = doc.data() as { nombre: string; profesor: string }; // Asegúrate de que esto coincida con tu estructura de datos
      return { id: doc.id, ...data }; // Usa el operador spread correctamente
    });
  }


// Método para obtener todos los documentos de la colección 'seccion'
async getAllSecciones(): Promise<{ id: string; nombre: string; asignatura: string; profesor: string }[]> {
  const snapshot = await this.firestore.collection('seccion').get().toPromise();
  const secciones = snapshot.docs.map(doc => {
    const data = doc.data() as { nombre: string; asignatura: string; profesor: string };
    return { id: doc.id, ...data };
  });
  console.log("Secciones obtenidas de Firestore:", secciones); // Verifica si se obtienen datos
  return secciones;
}


// Método para obtener los datos del profesor por su uid
async getProfesorNombre(uid: string): Promise<{ name: string; lastname: string }> {
  const docRef = doc(getFirestore(), `users/${uid}`); // Cambia 'users' por el nombre correcto de tu colección de usuarios
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      name: data["name"], // Acceso a 'name'
      lastname: data["lastname"] // Acceso a 'lastname'
    }; // Asegúrate de que 'name' sea el campo correcto en tu colección de usuarios
  } else {
    console.log("No se encontró el profesor.");
    return { name: "", lastname: "" }; // Retorna un objeto vacío si no se encuentra
  }
}




async getSeccionPorId(id: string): Promise<Seccion | null> {
  console.log('Buscando sección con ID:', id); // Log para ver el ID

  return new Promise<Seccion | null>((resolve, reject) => {
    this.firestore.collection('seccion').doc(id).get().subscribe({
      next: (seccionDoc) => {
        console.log('Resultado de la consulta:', seccionDoc.exists, seccionDoc.data()); // Log del resultado
        if (seccionDoc.exists) {
          const data = seccionDoc.data();
          // Verifica que `data` sea un objeto
          if (data && typeof data === 'object') {
            resolve({ uid: seccionDoc.id, ...data } as Seccion);
          } else {
            console.error('Los datos de la sección no son un objeto:', data);
            resolve(null);
          }
        } else {
          console.error('Sección no encontrada:', id);
          resolve(null);
        }
      },
      error: (error) => {
        console.error('Error obteniendo la sección:', error);
        reject(error);
      },
    });
  });
}


// Método para obtener la asignatura por su uid
async getAsignaturaPorId(uid: string): Promise<Asignatura | null> {
  const docRef = doc(getFirestore(), `asignatura/${uid}`);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return { uid: docSnap.id, nombre: data['nombre'] }; // Asegúrate de que 'nombre' sea el campo correcto
  } else {
    console.error('Asignatura no encontrada:', uid);
    return null;
  }
}





////////////////////////////////////////////////////////////////////////



async getAsignaturasDeEstudiante(uidEstudiante: string): Promise<{ asignatura: Asignatura, seccionId: string }[]> {
  // Obtener las secciones asociadas al estudiante desde la colección 'alumnoseccion'
  const alumnoSeccionesSnapshot = await this.firestore.collection<AlumnoSeccion>('alumnoseccion', ref => 
    ref.where('estudiante', '==', uidEstudiante)).get().toPromise();
  
  console.log('Snapshot de alumnoSecciones:', alumnoSeccionesSnapshot.docs.map(doc => doc.data()));
  const alumnoSecciones = alumnoSeccionesSnapshot.docs.map(doc => ({
    ...doc.data(),
    seccionId: doc.id // Guardar el UID de la sección
  }));

  // Obtener los IDs de las secciones
  const seccionesIds = alumnoSecciones.map(alumnoSeccion => alumnoSeccion.seccion);
  console.log('IDs de Secciones:', seccionesIds);

  if (seccionesIds.length === 0) {
    console.warn('No se encontraron secciones para el estudiante.');
    return []; // Retornar un array vacío si no hay secciones
  }

  // Obtener las secciones de la colección 'seccion'
  const seccionesSnapshot = await Promise.all(seccionesIds.map(async (seccionId) => {
    const seccionDoc = await this.firestore.collection<Seccion>('seccion').doc(seccionId).get().toPromise();
    return { ...seccionDoc.data(), seccionId } as Seccion & { seccionId: string };
  }));

  // Obtener los IDs de las asignaturas desde las secciones
  const asignaturasIds = seccionesSnapshot.map(seccion => seccion?.asignatura);
  console.log('IDs de Asignaturas:', asignaturasIds);

  if (asignaturasIds.length === 0) {
    console.warn('No se encontraron asignaturas para las secciones.');
    return []; // Retornar un array vacío si no hay asignaturas
  }

  // Obtener las asignaturas de la colección 'asignatura'
  const asignaturasSnapshot = await Promise.all(asignaturasIds.map(async (asignaturaId, index) => {
    const asignaturaDoc = await this.firestore.collection<Asignatura>('asignatura').doc(asignaturaId).get().toPromise();
    console.log('Asignatura:', asignaturaDoc.data());
    return { 
      asignatura: { uid: asignaturaDoc.id, ...asignaturaDoc.data() } as Asignatura,
      seccionId: seccionesSnapshot[index]?.seccionId // Asociar el UID de la sección correspondiente
    };
  }));

  return asignaturasSnapshot; // Retorna el array de asignaturas con sus respectivos UIDs de sección
}


async getSeccionById(seccionId: string): Promise<Seccion | null> {
  try {
    const seccionDoc = await this.firestore.collection('seccion').doc(seccionId).get().toPromise();
    if (seccionDoc.exists) {
      const seccionData = seccionDoc.data() as Seccion; // Asegúrate de hacer un cast al tipo Seccion
      return { uid: seccionId, ...seccionData }; // Combina el ID con los datos de la sección
    }
    return null;
  } catch (error) {
    console.error('Error al obtener la sección:', error);
    return null;
  }
}

async getAsignaturaById(asignaturaId: string): Promise<Asignatura> {
  const asignaturaDoc = await this.firestore.collection('asignatura').doc(asignaturaId).get().toPromise();
  if (asignaturaDoc.exists) {
    return asignaturaDoc.data() as Asignatura; // Asegúrate de que esto se convierta en un objeto de tipo Asignatura
  } else {
    throw new Error('Asignatura no encontrada');
  }
}


async getUserById(uid: string): Promise<User | null> {
  const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
  if (userDoc.exists) {
      const data = userDoc.data() as User; // Asegúrate de que esto se trate como un objeto User
      return { uid: userDoc.id, ...data }; // Aquí se usa el spread
  }
  return null;
}














































getAlumnosPorSeccion(seccionId: string): Promise<AlumnoSeccion[]> {
  return this.firestore.collection<AlumnoSeccion>('alumnoseccion', ref => ref.where('seccion', '==', seccionId))
    .get()
    .toPromise()
    .then(snapshot => {
      const alumnos: AlumnoSeccion[] = [];
      snapshot.forEach(doc => alumnos.push(doc.data()));
      return alumnos;
    })
    .catch(error => {
      console.error('Error obteniendo los alumnos:', error);
      throw error;
    });
}


















getEstudiantesBySeccion(seccionId: string): Observable<User[]> {
  return this.firestore.collection<AlumnoSeccion>('alumnoseccion', ref => ref.where('seccion', '==', seccionId)).snapshotChanges().pipe(
    switchMap(actions => {
      const uids = actions.map(a => a.payload.doc.data().estudiante);
      console.log('UIDs obtenidos:', uids); // Verifica los UIDs

      // Obtener los usuarios (estudiantes)
      const users$ = this.firestore.collection<User>('users', ref => ref.where('uid', 'in', uids)).valueChanges();

      // Obtener las asistencias
      const asistencia$ = this.firestore.collection<Asistencia>('asistencia', ref => ref.where('seccion_id', '==', seccionId).where('estudiante_id', 'in', uids)).valueChanges();

      // Obtener los detalles de la sección
      const seccion$ = this.firestore.collection<Seccion>('seccion').doc(seccionId).valueChanges();

      return combineLatest([users$, asistencia$, seccion$]).pipe(
        map(([users, asistencia, seccion]) => {
          // Combina los datos de los estudiantes, su asistencia y la sección
          return users.map(user => {
            const asistenciaEstudiante = asistencia.find(a => a.estudiante_id === user.uid);
            return {
              ...user,
              total_asistencia: asistenciaEstudiante ? asistenciaEstudiante.total_asistencia : 0, // Asistencia por defecto 0 si no se encuentra
              seccion: seccion, // Agregamos los detalles de la sección
            };
          });
        })
      );
    })
  );
}










getAsistenciaPorEstudianteYSeccion(estudianteId: string, seccionId: string): Promise<any[]> {
  return this.firestore.collection('asistencia', ref =>
    ref.where('estudiante_id', '==', estudianteId)
       .where('seccion_id', '==', seccionId)
  )
  .get()
  .toPromise()
  .then(snapshot => {
    if (snapshot.empty) {
      console.log('No se encontraron registros de asistencia');
      return [];  // Si no hay registros, devolvemos un array vacío
    } else {
      // Mapeamos los documentos a un array de objetos
      return snapshot.docs.map(doc => doc.data());  // Devuelve todos los datos de los documentos
    }
  })
  .catch(error => {
    console.error('Error obteniendo la asistencia:', error);
    return [];  // En caso de error, devolvemos un array vacío
  });
}























async updateAsistencia(uid: string, totalAsistencia: number) {
  try {
    const asistenciaDocRef = this.firestore.doc(`asistencia/${uid}`);
    await asistenciaDocRef.update({ total_asistencia: totalAsistencia });
    console.log(`Asistencia actualizada para uid: ${uid} con total_asistencias: ${totalAsistencia}`);
  } catch (error) {
    console.error('Error al actualizar asistencia:', error);
    throw error; // Lanza el error para manejarlo en el llamador
  }
}

async getAsistenciaPorUid(uid: string) {
  try {
    const docRef = this.firestore.doc(`asistencia/${uid}`);
    const doc = await docRef.get().toPromise();
    
    if (doc.exists) {
      return doc.data() as Asistencia; // Verifica que el tipo sea correcto
    } else {
      console.warn('Documento de asistencia no encontrado');
      return null; // Devuelve null en lugar de lanzar un error
    }
  } catch (error) {
    console.error('Error al obtener asistencia:', error);
    throw error; // Lanza el error para manejarlo en el llamador
  }
}



//////////////////////////ASISTENCIA_QR_MARCAR//////////////////////////////////////////////////////////////////////////////////////////////////////


// Método modificado para obtener el documento completo
async obtenerAsistenciaEstudiantePorSeccion(estudianteId: string, seccionId: string): Promise<Asistencia[]> {
  try {
    const snapshot = await this.firestore.collection('asistencia', ref =>
      ref.where('estudiante_id', '==', estudianteId)
         .where('seccion_id', '==', seccionId)
    ).get().toPromise();

    if (snapshot.empty) {
      console.log('No se encontraron registros de asistencia');
      return []; // No se encontraron registros
    } else {
      // Mapeamos los documentos y agregamos el 'id' del documento al resultado
      return snapshot.docs.map(doc => {
        return {
          id: doc.id, // El ID del documento es 'doc.id'
          ...doc.data() as Asistencia // Los datos del documento (total_asistencia, estudiante_id, etc.)
        };
      });
    }
  } catch (error) {
    console.error('Error obteniendo la asistencia:', error);
    return []; // Si ocurre un error, retornamos un arreglo vacío
  }
}




async actualizarAsistencia(uid: string, totalAsistencia: number) {
  try {
    const asistenciaDocRef = this.firestore.doc(`asistencia/${uid}`);
    await asistenciaDocRef.update({ total_asistencia: totalAsistencia });
    console.log(`Asistencia actualizada para uid: ${uid} con total_asistencias: ${totalAsistencia}`);
  } catch (error) {
    console.error('Error al actualizar asistencia:', error);
    throw error;
  }
}

async crearAsistencia(asistencia: any) {
  try {
    const docRef = await this.firestore.collection('asistencia').add(asistencia);
    console.log('Documento de asistencia creado con ID: ', docRef.id);
  } catch (error) {
    console.error('Error al crear el documento de asistencia:', error);
    throw error;
  }
}

}
