'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

interface NewsCardProps {
  event: {
    image: string;
    title: string;
    category: string;
    desc: string;
  };
  delay?: number;
}

export default function NewsCard({ event, delay = 0 }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <ScrollReveal delay={delay}>
      <div className="group space-y-8 flex flex-col h-full">
        <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shrink-0">
          <Image 
            src={event.image} 
            alt={event.title} 
            fill 
            sizes="(max-width: 1024px) 100vw, 33vw" 
            className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          <div className="absolute top-8 left-8">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] uppercase tracking-widest font-black text-white">
              {event.category}
            </span>
          </div>
        </div>
        
        <div className="space-y-4 px-2 text-center flex-1 flex flex-col items-center">
          <h4 className="text-2xl font-serif text-white group-hover:text-moss-100 transition-colors duration-500 leading-tight">
            {event.title}
          </h4>
          
          <div className="mt-2 text-white/50 text-sm italic font-serif leading-relaxed">
            <motion.p
              initial={false}
              animate={{ height: expanded ? 'auto' : '2.8em' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`overflow-hidden ${!expanded ? 'line-clamp-2' : ''}`}
            >
              {event.desc}
            </motion.p>
          </div>
          
          <button 
            onClick={() => setExpanded(!expanded)}
            className="mt-6 text-[10px] uppercase tracking-[0.4em] font-black text-moss-100 opacity-60 hover:opacity-100 transition-opacity pb-1 border-b border-moss-100/30 hover:border-moss-100 flex-shrink-0"
          >
            {expanded ? 'Read Less' : 'More'}
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
}
