import { Star } from "lucide-react";
import { AnimatedSection } from "../share/animated-section";
export const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Sarah Ahmed",
      role: "Examination Controller",
      institution: "National University",
      rating: 5,
      text: "dateSheet.com reduced our scheduling time from 2 weeks to just 2 hours. The conflict detection for repeater students is exceptional.",
    },
    {
      name: "Prof. Muhammad Ali",
      role: "Academic Coordinator",
      institution: "Institute of Technology",
      rating: 5,
      text: "Managing 5000+ students across 8 departments was a nightmare. Now it's automated and error-free. Highly recommended!",
    },
    {
      name: "Ms. Fatima Khan",
      role: "Registrar Office",
      institution: "City College",
      rating: 5,
      text: "The Excel import feature is brilliant. Our staff learned it in minutes. No more manual conflicts and student complaints.",
    },
    {
      name: "Dr. Hassan Raza",
      role: "Dean of Studies",
      institution: "State University",
      rating: 5,
      text: "Best investment for our examination department. The support for both fresher and repeater students is exactly what we needed.",
    },
  ];

  function getInitial(value: string): string {
    return value.charAt(0).toUpperCase();
  }

  return (
    <section className="px-4 py-20 lg:px-12 border-t border-zinc-800/50">
      <AnimatedSection className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-cyan-400 mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Trusted by Institutions
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, i) => (
            <AnimatedSection
              key={i}
              delay={i * 100}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-zinc-900/70"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star
                    key={j}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-zinc-300 leading-relaxed mb-6 italic">
                {`"${testimonial.text}"`}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 text-white font-bold">
                  {testimonial.name.split(" ").map(getInitial).join("")}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-zinc-400">{testimonial.role}</p>
                  <p className="text-xs text-cyan-400">
                    {testimonial.institution}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
};
