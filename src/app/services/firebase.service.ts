import { inject, Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,sendPasswordResetEmail,updatePassword, signOut} from 'firebase/auth'
import { User } from '../models/user.model';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {getFirestore,setDoc,doc, getDoc, collectionData, getDocs,collection,Firestore, addDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { Seccion } from '../models/seccion.model';
import { Asignatura } from '../models/asignatura.model';
import { AlumnoSeccion } from '../models/alumnoseccion.model';
import { Observable, switchMap, forkJoin, combineLatest, map } from 'rxjs';
import { Asistencia } from '../models/asistencia.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  localStorageSvc = inject(LocalStorageService);
  navCtrl =  inject(NavController);

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
    localStorage.setItem('sessionActive', 'true'); // Marca la sesión como activa
    return userCredential;
  });
}

//=========Crear==========
signUp(user: User){
  localStorage.setItem('sessionActive', 'true'); // Marca la sesión como activa
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
  const auth = getAuth(); // Obtener instancia de autenticación de Firebase
  signOut(auth).then(() => {
    this.resetUserData(); // Resetea los datos del usuario del localStorage
    const scannedUIDs = localStorage.getItem('scannedUIDs');
    localStorage.setItem('sessionActive', 'false');
    this.navCtrl.navigateRoot('/login');
    
    if (scannedUIDs) {
      localStorage.setItem('scannedUIDs', scannedUIDs);
    }
  }).catch((error) => {
    // Manejar errores, si es necesario
    console.error('Error al cerrar sesión:', error);
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



//=======================================================//

  // Método para crear una nueva asignatura
  async createAsignatura(asignatura: Asignatura) {
    try {
      const asignaturasRef = this.firestore.collection('asignatura');
      const docRef = await asignaturasRef.add(asignatura);  // Usamos .add() para agregar el documento
      return docRef;  // Retorna el DocumentReference con el id del nuevo documento
    } catch (error) {
      console.error('Error al crear la asignatura: ', error);
      throw error;
    }
  }

  // Método para actualizar una asignatura con su UID (si ya tiene un id)
  async updateAsignatura(asignatura: Asignatura) {
    try {
      if (!asignatura.uid) {
        throw new Error('UID de asignatura es necesario para la actualización');
      }

      const asignaturaRef = this.firestore.collection('asignatura').doc(asignatura.uid);
      await asignaturaRef.set(asignatura);  // Usamos .set() para actualizar el documento
    } catch (error) {
      console.error('Error al actualizar la asignatura: ', error);
      throw error;
    }
  }

  // Método para crear una sección
  async createSeccion(seccion: Seccion) {
    try {
      // Agregar la nueva sección a la colección "secciones"
      const docRef = await this.firestore.collection('seccion').add(seccion);
      return docRef; // Retornar el DocumentReference
    } catch (error) {
      console.error('Error al crear la sección:', error);
      throw new Error('Error al crear la sección');
    }
  }
  

  // Método para actualizar una asignatura con su UID (si ya tiene un id)
  async updateSeccion(seccion: Seccion) {
    try {
      if (!seccion.uid) {
        throw new Error('UID de seccion es necesario para la actualización');
      }

      const seccionRef = this.firestore.collection('seccion').doc(seccion.uid);
      await seccionRef.set(seccion);  // Usamos .set() para actualizar el documento
    } catch (error) {
      console.error('Error al actualizar la seccion: ', error);
      throw error;
    }
  }







//===============================================================//

// En el servicio FirebaseService (firebase.service.ts)
async getAsignaturasPorProfesor(profesorUid: string): Promise<Asignatura[]> {
  try {
    const asignaturasSnapshot = await this.firestore.collection<Asignatura>('asignatura', ref => 
      ref.where('uid_profesor', '==', profesorUid)).get().toPromise();
    return asignaturasSnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error al obtener asignaturas para el profesor:', error);
    throw error;
  }
}



//================================================================//


//================================ Yo datos de asig

  // Nuevo método para obtener todos los documentos de una colección
  async getAllDocuments(): Promise<{ id: string; nombre: string; profesor: string  }[]> {
    const snapshot = await this.firestore.collection('asignatura').get().toPromise();
    return snapshot.docs.map(doc => {
      const data = doc.data() as { nombre: string; profesor: string }; // Asegúrate de que esto coincida con tu estructura de datos
      return { id: doc.id, ...data }; // Usa el operador spread correctamente
    });
  }



// Método para obtener todos los documentos de la colección 'secciones'
// Método para obtener todos los documentos de la colección 'secciones'
async getAllSecciones(): Promise<Seccion[]> {
  try {
    const snapshot = await this.firestore.collection('seccion').get().toPromise();
    
    // Verificar si los documentos están vacíos
    if (snapshot.empty) {
      console.log('No se encontraron secciones en Firestore.');
      return [];
    }

    // Mapea los datos a la estructura de tipo 'Seccion'
    const secciones = snapshot.docs.map(doc => {
      const data = doc.data() as { nombre: string; asignatura: string; profesor: string; aula?: string; total_clases?: number };
      return {
        uid: doc.id,               // El 'id' de Firestore se convierte en el 'uid' de la sección
        nombre: data.nombre || '',  // Si no tiene nombre, asigna un string vacío
        asignatura: data.asignatura || '',  // Si no tiene asignatura, asigna un string vacío
        profesor: data.profesor || '',  // Si no tiene profesor, asigna un string vacío
        aula: data.aula || '',  // Si no tiene aula, asigna un string vacío
        total_clases: data.total_clases || 0  // Si no tiene total_clases, asigna 0
      };
    });
    console.log("Secciones obtenidas de Firestore:", secciones); // Verifica si se obtienen datos
    return secciones;
  } catch (error) {
    console.error('Error al obtener las secciones:', error);
    throw error;
  }
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
    return { uid: docSnap.id, uid_profesor: data['uid_profesor'],nombre: data['nombre'], maxEstudiantes: data['maxEstudiantes'] }; // Asegúrate de que 'nombre' sea el campo correcto
  } else {
    console.error('Asignatura no encontrada:', uid);
    return null;
  }
}





////////////////////////////////////////////////////////////////////////



async getAsignaturasDeEstudiante(uidEstudiante: string): Promise<{ asignatura: Asignatura, seccionId: string }[]> {
  // Obtener las secciones asociadas al estudiante desde la colección 'alumnoseccion'
  const alumnoSeccionesSnapshot = await this.firestore.collection<AlumnoSeccion>('alumnoseccion', ref => 
    ref.where('alumno', '==', uidEstudiante)).get().toPromise();
  
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
      const uids = actions.map(a => a.payload.doc.data().alumno);
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

















































// Método para obtener las asignaturas disponibles
getAsignaturas(): Observable<Asignatura[]> {
  return this.firestore.collection<Asignatura>('asignatura').valueChanges();
}

getTodasLasSecciones(): Observable<Seccion[]> {
  return this.firestore.collection('seccion').valueChanges({ idField: 'uid' }).pipe(
    map((data: any[]) => 
      data.map(item => ({
        uid: item.uid,
        nombre: item.nombre || '',
        asignatura: item.asignatura || '',
        aula: item.aula || '',
        profesor: item.profesor || ''
      }))
    )
  );
}


// Método para obtener las secciones por asignatura
getSeccionesPorAsignatura(asignaturaUid: string) {
  return this.firestore.collection('seccion', ref => ref.where('asignatura', '==', asignaturaUid))
    .snapshotChanges() // Esto te da acceso a los cambios de los documentos
    .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Seccion;
        const id = a.payload.doc.id;  // Aquí se obtiene el UID del documento (ID)
        return { id, ...data }; // Añadimos el ID al objeto de la sección
      }))
    );
}


// Método para inscribir al estudiante
inscribirEstudiante(alumnoUid: string, seccionUid: string,asignaturaUid: string ): Promise<void> {
  // Validar que los valores no sean null o undefined
  if (!alumnoUid || !seccionUid || !asignaturaUid) {
    return Promise.reject('Faltan datos para realizar la inscripción. Verifica que los valores sean correctos.');
  }  
  
  const inscripcionRef = this.firestore.collection('alumnoseccion').doc(); // Genera un nuevo documento
  return inscripcionRef.set({
    alumno: alumnoUid,
    seccion: seccionUid,
    asignatura: asignaturaUid,
  });
}



// Método que verifica si el alumno ya está inscrito en una sección de la misma asignatura
async verificarInscripcionExistente(alumnoUid: string, asignaturaUid: string): Promise<boolean> {
  try {
    // Aquí consultamos si el alumno está inscrito en alguna sección de la asignatura
    const inscripcionesRef = this.firestore.collection('alumnoseccion', ref => ref.where('alumno', '==', alumnoUid).where('asignatura', '==', asignaturaUid));
    const snapshot = await inscripcionesRef.get().toPromise();
    return snapshot.empty; // Si no hay inscripciones, retorna true (puede inscribirse)
  } catch (error) {
    console.error('Error al verificar la inscripción:', error);
    throw new Error('Error al verificar la inscripción');
  }
}






/**
 * Sincroniza las asistencias almacenadas localmente con Firebase.
 */
async syncOfflineAttendance() {
  const asistenciasOffline = await this.localStorageSvc.get('asistencias_offline');

  if (asistenciasOffline && asistenciasOffline.length > 0) {
    for (const asistencia of asistenciasOffline) {
      const asistenciaExistente = await this.obtenerAsistenciaEstudiantePorSeccion(asistencia.estudiante_id, asistencia.seccion_id);

      if (asistenciaExistente && asistenciaExistente.length > 0) {
        const asistenciaFirebase = asistenciaExistente[0];
        const updatedTotal = (asistenciaFirebase.total_asistencia || 0) + asistencia.total_asistencia;
        await this.actualizarAsistencia(asistenciaFirebase.id, updatedTotal);
      } else {
        await this.crearAsistencia({
          estudiante_id: asistencia.estudiante_id,
          seccion_id: asistencia.seccion_id,
          total_asistencia: asistencia.total_asistencia,
        });
      }
    }

    // Limpia los datos locales después de sincronizar
    await this.localStorageSvc.set('asistencias_offline', []);
    console.log('Sincronización de asistencias completada.');
  }
}




  // Método para sincronizar las asignaturas offline con Firebase
  async syncOfflineAsignaturas() {
    const asignaturasOffline = (await this.localStorageSvc.get('asignaturasOffline')) || [];

    if (asignaturasOffline.length > 0) {
      for (const asignatura of asignaturasOffline) {
        try {
          // Crear la asignatura en Firebase
          const asignaturaCreada = await this.createAsignatura(asignatura);
          asignatura.uid = asignaturaCreada.id;

          // Actualizar la asignatura con su UID en Firebase
          await this.updateAsignatura(asignatura);

          // Eliminar la asignatura del almacenamiento local después de la sincronización
          const updatedAsignaturasOffline = asignaturasOffline.filter((a: Asignatura) => a.uid !== asignatura.uid);
          await this.localStorageSvc.set('asignaturasOffline', updatedAsignaturasOffline);
        } catch (error) {
          console.error('Error al sincronizar asignatura offline:', error);
        }
      }
    }
  }




  async syncOfflineSecciones() {
    const seccionesOffline = await this.localStorageSvc.get('seccionesOffline') || [];
  
    if (seccionesOffline.length === 0) {
      console.log('No hay secciones para sincronizar.');
      return;
    }
  
    // Sincroniza cada sección offline con Firebase
    for (const seccion of seccionesOffline) {
      try {
        // Primero intentamos crear la sección en Firebase
        const docRef = await this.createSeccion(seccion);
        seccion.uid = docRef.id;  // Asignamos el UID generado por Firebase
  
        // Luego actualizamos la sección con el UID
        await this.updateSeccion(seccion);
        console.log('Sección sincronizada:', seccion);
      } catch (error) {
        console.error('Error al sincronizar la sección:', error);
      }
    }
  
    // Elimina las secciones sincronizadas si lo deseas
    await this.localStorageSvc.set('seccionesOffline', []); // Limpia las secciones offline una vez sincronizadas
    console.log('Secciones offline sincronizadas correctamente.');
  }


  async sincronizarInscripciones() {
    const inscripcionesOffline = this.localStorageSvc.get('inscripcionesOffline') || [];
    
    for (const inscripcion of inscripcionesOffline) {
      // Verificar si el alumno ya está inscrito en otra sección de la misma asignatura
      const yaInscripto = await this.verificarInscripcionExistente(
        inscripcion.alumno,
        inscripcion.asignatura
      );
  
      if (!yaInscripto) {
        this.utilsSvc.presentToast({
          message: `El estudiante ya está inscrito en otra sección de la asignatura`,
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
        continue; // Pasar a la siguiente inscripción si ya está inscrito
      }
  
      // Inscribir al estudiante si la validación pasa
      await this.inscribirEstudiante(
        inscripcion.alumno,
        inscripcion.seccion,
        inscripcion.asignatura
      );
    }
  
    // Limpiar inscripciones locales tras sincronización
    this.localStorageSvc.set('inscripcionesOffline', []);
  }


}
