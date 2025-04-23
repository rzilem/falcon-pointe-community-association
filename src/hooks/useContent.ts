
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Content {
  id: string;
  section: string;
  title: string | null;
  content: string | null;
}

export const useContent = (section: string) => {
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('site_content')
          .select('*')
          .eq('section', section)
          .eq('active', true)
          .single();
        
        if (fetchError) {
          // If there's no content for this section, don't show an error
          if (fetchError.code === 'PGRST116') {
            setContent(null);
          } else {
            throw fetchError;
          }
        } else {
          setContent(data);
        }
      } catch (err) {
        console.error(`Error fetching content for section ${section}:`, err);
        setError('Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [section]);

  return { content, isLoading, error };
};
