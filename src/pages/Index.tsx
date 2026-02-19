import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const departments = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil", "BCA", "MCA", "Commerce", "Mathematics"];

const Index = () => {
  const navigate = useNavigate();
  const { setStudent } = useQuiz();
  const [fullName, setFullName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [touched, setTouched] = useState({ fullName: false, regNumber: false, department: false });

  const isValid = fullName.trim() !== "" && regNumber.trim() !== "" && department !== "" && confirmed;

  const handleSubmit = () => {
    if (!isValid) return;
    setStudent({ fullName: fullName.trim(), regNumber: regNumber.trim(), department });
    navigate("/rules");
  };

  return (
    <Layout>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Student Login</CardTitle>
          <CardDescription>Enter your details to begin the quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
            />
            {touched.fullName && !fullName.trim() && <p className="text-xs text-destructive">Full name is required.</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="regNumber">Registration Number</Label>
            <Input
              id="regNumber"
              placeholder="Enter your registration number"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, regNumber: true }))}
            />
            {touched.regNumber && !regNumber.trim() && <p className="text-xs text-destructive">Registration number is required.</p>}
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={department} onValueChange={(v) => { setDepartment(v); setTouched((t) => ({ ...t, department: true })); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.department && !department && <p className="text-xs text-destructive">Department is required.</p>}
          </div>
          <div className="flex items-start gap-2 pt-2">
            <Checkbox id="confirm" checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} />
            <Label htmlFor="confirm" className="text-sm leading-tight">I confirm that the information provided is accurate.</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={!isValid} onClick={handleSubmit}>Start Quiz</Button>
        </CardFooter>
      </Card>
    </Layout>
  );
};

export default Index;
