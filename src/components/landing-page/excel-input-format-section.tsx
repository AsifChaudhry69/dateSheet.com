import { FileSpreadsheet } from "lucide-react";
import { AnimatedSection } from "../share/animated-section";
export const Excel = () => {
  return (
    <section className="px-4 py-20 lg:px-12 border-t border-zinc-800/50">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <AnimatedSection>
            <p className="text-sm font-medium uppercase tracking-widest text-cyan-400 mb-3">
              Excel Input Format
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl mb-6">
              Simple Data Structure
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Our system accepts a straightforward Excel format. Just organize
              your data with the required columns and let our algorithm handle
              the complexity of scheduling.
            </p>
            <div className="space-y-4">
              {[
                {
                  num: 1,
                  title: "Course Information",
                  desc: "Course code, name, credit hours, and department",
                },
                {
                  num: 2,
                  title: "Student Enrollment",
                  desc: "Student ID, enrolled courses, and current semester",
                },
                {
                  num: 3,
                  title: "Student Type Flag",
                  desc: "Mark students as Fresher or Repeater for each course",
                },
                {
                  num: 4,
                  title: "Exam Duration",
                  desc: "Specify exam duration for proper time slot allocation",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-cyan-400 font-semibold transition-all group-hover:bg-cyan-500 group-hover:text-zinc-950">
                    {item.num}
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{item.title}</h4>
                    <p className="text-sm text-zinc-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection
            delay={200}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/30"
          >
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-zinc-800">
              <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium">sample_data.xlsx</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-2 px-3 text-cyan-400 font-medium">
                      Course
                    </th>
                    <th className="text-left py-2 px-3 text-cyan-400 font-medium">
                      Student ID
                    </th>
                    <th className="text-left py-2 px-3 text-cyan-400 font-medium">
                      Type
                    </th>
                    <th className="text-left py-2 px-3 text-cyan-400 font-medium">
                      Semester
                    </th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {[
                    {
                      course: "CS101",
                      id: "2024-001",
                      type: "Fresher",
                      semester: "1st",
                    },
                    {
                      course: "CS201",
                      id: "2023-045",
                      type: "Repeater",
                      semester: "3rd",
                    },
                    {
                      course: "MT102",
                      id: "2024-012",
                      type: "Fresher",
                      semester: "1st",
                    },
                    {
                      course: "PH101",
                      id: "2022-089",
                      type: "Repeater",
                      semester: "5th",
                    },
                    {
                      course: "CS102",
                      id: "2024-001",
                      type: "Fresher",
                      semester: "1st",
                    },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-zinc-800/50 transition-all hover:bg-zinc-800/30"
                    >
                      <td className="py-2 px-3">{row.course}</td>
                      <td className="py-2 px-3">{row.id}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`rounded px-2 py-0.5 text-xs ${row.type === "Fresher" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="py-2 px-3">{row.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
