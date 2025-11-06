module Jekyll
  module BibtexAppendDoi
    # Append a doi field to a BibTeX entry string just before the final closing brace.
    # - If doi is blank or the bib already contains a doi field, return bib unchanged.
    # - Preserves surrounding whitespace and tries not to add duplicate commas.
    def append_doi(bibtex, doi)
      return bibtex if doi.nil? || doi.to_s.strip == ''
      # If bibtex already contains a doi= field (simple check), leave it
      return bibtex if bibtex =~ /\bdoi\s*=\s*\{/i

      # Find last closing brace '}' in the string
      idx = bibtex.rindex('}')
      if idx.nil?
        # No closing brace found -- append a doi line at the end
        return bibtex + "\n  doi = {#{doi}}\n"
      end

      # Split into prefix (before last brace) and suffix (from last brace)
      prefix = bibtex[0...idx]
      suffix = bibtex[idx..-1]

      # Make sure prefix ends without excessive whitespace
      prefix_stripped = prefix.rstrip

      # If the last non-space char before the final brace is not a comma,
      # add a comma so the doi becomes another field. Otherwise, no extra comma.
      sep = prefix_stripped.end_with?(',') ? "\n" : ",\n"

      inserted = "#{sep}  doi = {#{doi}}\n"

      # Reconstruct and return
      return prefix_stripped + inserted + suffix.lstrip
    end
  end
end

Liquid::Template.register_filter(Jekyll::BibtexAppendDoi)
