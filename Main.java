import student.Student;
import course.Course;

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student(101, "Rohan Kumar", "Computer Science", 2);
        Course c1 = new Course("CS201", "Data Structures", 4, "Dr. Anita Sharma");

        System.out.println("----- Student Details -----");
        s1.displayStudentInfo();

        System.out.println("\n----- Course Details -----");
        c1.displayCourseInfo();
    }
}
