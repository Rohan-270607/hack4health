import doctor.Doctor;
import patient.Patient;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        // Create doctors
        Doctor[] doctors = {
            new Doctor(1, "Anita Sharma", "Cardiologist", 800.0),
            new Doctor(2, "Vikram Rao", "Orthopedic", 600.0)
        };

        // Create patients
        Patient[] patients = {
            new Patient(101, "Rahul Mehta", "Heart Pain", 45),
            new Patient(102, "Sneha Iyer", "Fracture", 25),
            new Patient(103, "Karan Verma", "Chest Pain", 50)
        };

        // Map disease keywords to required specialization
        Map<String, String> diseaseToSpecialization = new HashMap<>();
        diseaseToSpecialization.put("Heart Pain", "Cardiologist");
        diseaseToSpecialization.put("Chest Pain", "Cardiologist");
        diseaseToSpecialization.put("Fracture", "Orthopedic");

        // Assign each patient to the appropriate doctor and display details
        for (Patient p : patients) {
            String requiredSpecialization = diseaseToSpecialization.get(p.getDisease());
            Doctor assignedDoctor = null;

            for (Doctor d : doctors) {
                if (d.getSpecialization().equals(requiredSpecialization)) {
                    assignedDoctor = d;
                    break;
                }
            }
            // Fallback: assign the first doctor if no specialization match found
            if (assignedDoctor == null) {
                assignedDoctor = doctors[0];
            }

            assignedDoctor.addPatient();

            System.out.println("----- Patient Details -----");
            p.displayPatientInfo();
            System.out.println("----- Assigned Doctor -----");
            assignedDoctor.displayDoctorInfo();
            System.out.println();
        }

        // Display total consultation fee collected by each doctor
        System.out.println("----- Total Consultation Fee Collected -----");
        for (Doctor d : doctors) {
            System.out.println("Dr. " + d.getName() + " (" + d.getSpecialization() + ") : "
                    + d.getTotalFeeCollected());
        }
    }
}
