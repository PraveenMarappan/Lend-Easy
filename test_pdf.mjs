import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const doc = new jsPDF();
doc.text("Rupee: ₹ 1000", 10, 10);
doc.save("test_rupee.pdf");
console.log("success");
