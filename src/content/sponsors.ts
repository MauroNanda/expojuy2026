import comafi from "../assets/sponsors/banco-comafi.jpg";
import macro from "../assets/sponsors/macro.jpg";
import neuralsoft from "../assets/sponsors/neuralsoft.jpg";
import rosato from "../assets/sponsors/rosato.jpg";
import sancor from "../assets/sponsors/sancor-salud.webp";
import ypf from "../assets/sponsors/ypf.jpg";

export interface SponsorReference {
  name: string;
  logo: string;
  website?: string;
  /** Optical width in CSS pixels, limited to the source resolution. */
  displayWidth: number;
}

// Alphabetical, not a commercial ranking. Provenance: assets/sponsors/README.md.
export const sponsorReferences: readonly SponsorReference[] = [
  {
    name: "Banco Comafi",
    logo: comafi,
    website: "https://www.comafi.com.ar/",
    displayWidth: 202,
  },
  {
    name: "Macro",
    logo: macro,
    website: "https://www.macro.com.ar/",
    displayWidth: 120,
  },
  {
    name: "NeuralSoft",
    logo: neuralsoft,
    website: "https://neuralsoft.com/",
    displayWidth: 157,
  },
  {
    name: "Rosato",
    logo: rosato,
    website: "https://rosatosa.com/",
    displayWidth: 229,
  },
  {
    name: "SanCor Salud",
    logo: sancor,
    website: "https://sancorsalud.com.ar/",
    displayWidth: 240,
  },
  {
    name: "YPF",
    logo: ypf,
    website: "https://www.ypf.com/",
    displayWidth: 170,
  },
];
