import { ArrowRight, MapPin } from "lucide-react";
import { newsItems, upcomingEvents } from "@/components/edc/updates";

export function NewsAndEvents() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12">

        {/* NEWS & UPDATES */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold tracking-widest text-foreground uppercase">News & Updates</h2>
            <a href="/updates" className="flex items-center gap-1 text-xs font-semibold text-accent hover:opacity-80 transition-opacity uppercase tracking-wider">
              View All <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {newsItems.map((item) => (
              <a key={item.id} href={item.link} className="flex items-start gap-4 py-4 group">
               <div className="w-20 h-14 rounded-lg flex-shrink-0 bg-card border border-border overflow-hidden flex items-center justify-center">
  {item.image ? (
    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
  ) : (
    <span className="text-2xl">📰</span>
  )}
</div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-accent transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* UPCOMING EVENTS */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold tracking-widest text-foreground uppercase">Upcoming Events</h2>
            <a href="/updates" className="flex items-center gap-1 text-xs font-semibold text-accent hover:opacity-80 transition-opacity uppercase tracking-wider">
              View All <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {upcomingEvents.map((event) => (
              <a key={event.id} href={event.link} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 py-4 group">
                <div className="w-14 flex-shrink-0 rounded-lg border border-border bg-card flex flex-col items-center justify-center py-2">
                  <span className="text-xl font-bold text-accent leading-none">{event.day}</span>
                  <span className="text-xs font-semibold text-muted-foreground tracking-widest mt-0.5">{event.month}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-accent transition-colors">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{event.desc}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{event.location}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}