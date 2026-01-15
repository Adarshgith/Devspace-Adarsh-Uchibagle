import {ReactNode} from 'react'

interface BlockRenderProps {
  children: ReactNode
}

const PrimaryColor = '#f15c22'
const SecondaryColor = '#212944'
const TertiaryColor = '#11a8a7'
const LightGreyColor = '#f9f9f9'
const MidGreyColor = '#9ca1a5'
const DarkGreyColor = '#525d68'
const BlogMintColor = '#68ccb8'
const BlogTealColor = '#1c7d98'
const BlogCyanColor = '#2cb8e2'
const SepsisRed1Color = '#a81d4c'
const SepsisRed2Color = '#c85163'
const SepsisRed3Color = '#7b133a'
const SepsisRed4Color = '#3d1123'
const PedPurple1Color = '#631d5a'
const PedPurple2Color = '#9b6297'
const PedPurple3Color = '#932788'
const PedPurple4Color = '#3c0538'
const ImmunoBlue1Color = '#1ba1bf'
const ImmunoBlue2Color = '#4ebcce'
const ImmunoBlue3Color = '#058094'
const ImmunoBlue4Color = '#0e4c5c'
const ApplicationPneumonia = '#932788'
const ApplicationFebrileNeutropenia = '#00bbe6'
const ApplicationInvasiveFungalInfections = '#00a9a8'
const ApplicationEndocarditis = '#a81d4c'

const PrimaryColorIcon = () => <div style={{color: PrimaryColor}}>abc</div>

const SecondaryColorIcon = () => <div style={{color: SecondaryColor}}>abc</div>

const TertiaryColorIcon = () => <div style={{color: TertiaryColor}}>abc</div>

const LightGreyColorIcon = () => <div style={{color: LightGreyColor}}>abc</div>

const MidGreyColorIcon = () => <div style={{color: MidGreyColor}}>abc</div>

const DarkGreyColorIcon = () => <div style={{color: DarkGreyColor}}>abc</div>

const BlogMintColorIcon = () => <div style={{color: BlogMintColor}}>abc</div>

const BlogTealColorIcon = () => <div style={{color: BlogTealColor}}>abc</div>

const BlogCyanColorIcon = () => <div style={{color: BlogCyanColor}}>abc</div>

const SepsisRed1ColorIcon = () => <div style={{color: SepsisRed1Color}}>abc</div>

const SepsisRed2ColorIcon = () => <div style={{color: SepsisRed2Color}}>abc</div>

const SepsisRed3ColorIcon = () => <div style={{color: SepsisRed3Color}}>abc</div>

const SepsisRed4ColorIcon = () => <div style={{color: SepsisRed4Color}}>abc</div>

const PedPurple1ColorIcon = () => <div style={{color: PedPurple1Color}}>abc</div>

const PedPurple2ColorIcon = () => <div style={{color: PedPurple2Color}}>abc</div>

const PedPurple3ColorIcon = () => <div style={{color: PedPurple3Color}}>abc</div>

const PedPurple4ColorIcon = () => <div style={{color: PedPurple4Color}}>abc</div>

const ImmunoBlue1ColorIcon = () => <div style={{color: ImmunoBlue1Color}}>abc</div>

const ImmunoBlue2ColorIcon = () => <div style={{color: ImmunoBlue2Color}}>abc</div>

const ImmunoBlue3ColorIcon = () => <div style={{color: ImmunoBlue3Color}}>abc</div>

const ImmunoBlue4ColorIcon = () => <div style={{color: ImmunoBlue4Color}}>abc</div>

const ApplicationPneumoniaIcon = () => <div style={{color: ApplicationPneumonia}}>abc</div>

const ApplicationFebrileNeutropeniaIcon = () => (
  <div style={{color: ApplicationFebrileNeutropenia}}>abc</div>
)

const ApplicationInvasiveFungalInfectionsIcon = () => (
  <div style={{color: ApplicationInvasiveFungalInfections}}>abc</div>
)

const ApplicationEndocarditisIcon = () => <div style={{color: ApplicationEndocarditis}}>abc</div>

export const brandColors = [
  {
    title: 'Primary',
    value: 'primary',
    icon: PrimaryColorIcon, // Directly use the icon as specified
    component: (
      {children}: BlockRenderProps, // Use 'component' to define the rendering
    ) => <span style={{color: PrimaryColor}}>{children}</span>,
  },
  {
    title: 'Secondary',
    value: 'secondary',
    icon: SecondaryColorIcon, // Directly use the icon as specified
    component: (
      {children}: BlockRenderProps, // Use 'component' to define the rendering
    ) => <span style={{color: SecondaryColor}}>{children}</span>,
  },
  {
    title: 'Tertiary',
    value: 'tertiary',
    icon: TertiaryColorIcon, // Use the icon directly as mentioned in the documentation
    component: (
      {children}: BlockRenderProps, // Use 'component' instead of 'blockEditor' and 'render'
    ) => <span style={{color: TertiaryColor}}>{children}</span>,
  },

  {
    title: 'Light Grey',
    value: 'lightGrey',
    icon: LightGreyColorIcon, // Use the icon directly as specified
    component: (
      {children}: BlockRenderProps, // Replace 'blockEditor' and 'render' with 'component'
    ) => <span style={{color: LightGreyColor}}>{children}</span>,
  },
  {
    title: 'Mid Grey',
    value: 'midGrey',
    icon: MidGreyColorIcon, // Use the icon directly as specified
    component: (
      {children}: BlockRenderProps, // Use 'component' to define the rendering
    ) => <span style={{color: MidGreyColor}}>{children}</span>,
  },
  {
    title: 'Dark Grey',
    value: 'darkGrey',
    icon: DarkGreyColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: DarkGreyColor}}>{children}</span>
    ),
  },
  {
    title: 'Blog Mint',
    value: 'blogMint',
    icon: BlogMintColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: BlogMintColor}}>{children}</span>
    ),
  },
  {
    title: 'Blog Teal',
    value: 'blogTeal',
    icon: BlogTealColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: BlogTealColor}}>{children}</span>
    ),
  },
  {
    title: 'Blog Cyan',
    value: 'blogCyan',
    icon: BlogCyanColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: BlogCyanColor}}>{children}</span>
    ),
  },
  {
    title: 'Sepsis Red #1',
    value: 'sepsisRed1',
    icon: SepsisRed1ColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: SepsisRed1Color}}>{children}</span>
    ),
  },
  {
    title: 'Sepsis Red #2',
    value: 'sepsisRed2',
    icon: SepsisRed2ColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: SepsisRed2Color}}>{children}</span>
    ),
  },
  {
    title: 'Sepsis Red #3',
    value: 'sepsisRed3',
    icon: SepsisRed3ColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: SepsisRed3Color}}>{children}</span>
    ),
  },
  {
    title: 'Sepsis Red #4',
    value: 'sepsisRed4',
    icon: SepsisRed4ColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: SepsisRed4Color}}>{children}</span>
    ),
  },
  {
    title: 'Pediatric Purple #1',
    value: 'pedPurple1',
    icon: PedPurple1ColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: PedPurple1Color}}>{children}</span>
    ),
  },
  {
    title: 'Pediatric Purple #2',
    value: 'pedPurple2',
    icon: PedPurple2ColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: PedPurple2Color}}>{children}</span>
    ),
  },
  {
    title: 'Pediatric Purple #3',
    value: 'pedPurple3',
    icon: PedPurple3ColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: PedPurple3Color}}>{children}</span>
    ),
  },
  {
    title: 'Pediatric Purple #4',
    value: 'pedPurple4',
    icon: PedPurple4ColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: PedPurple4Color}}>{children}</span>
    ),
  },
  {
    title: 'Immunocompromised Blue #1',
    value: 'immunoBlue1',
    icon: ImmunoBlue1ColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: ImmunoBlue1Color}}>{children}</span>
    ),
  },
  {
    title: 'Immunocompromised Blue #2',
    value: 'immunoBlue2',
    icon: ImmunoBlue2ColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: ImmunoBlue2Color}}>{children}</span>
    ),
  },
  {
    title: 'Immunocompromised Blue #3',
    value: 'immunoBlue3',
    icon: ImmunoBlue3ColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: ImmunoBlue3Color}}>{children}</span>
    ),
  },
  {
    title: 'Immunocompromised Blue #4',
    value: 'immunoBlue4',
    icon: ImmunoBlue4ColorIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: ImmunoBlue4Color}}>{children}</span>
    ),
  },
  {
    title: 'Application - Pneumonia',
    value: 'applicationPneumoniaColour',
    icon: ApplicationPneumoniaIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: ApplicationPneumonia}}>{children}</span>
    ),
  },
  {
    title: 'Application - Febrile Neutropenia',
    value: 'applicationFebrileNeutropeniaColour',
    icon: ApplicationFebrileNeutropeniaIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: ApplicationFebrileNeutropenia}}>{children}</span>
    ),
  },
  {
    title: 'Application - Invasive Fungal Infections',
    value: 'applicationInvasiveFungalInfectionsColour',
    icon: ApplicationInvasiveFungalInfectionsIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: ApplicationInvasiveFungalInfections}}>{children}</span>
    ),
  },
  {
    title: 'Application - Endocarditis',
    value: 'applicationEndocarditisColour',
    icon: ApplicationEndocarditisIcon,
    component: ({children}: BlockRenderProps) => (
      <span style={{color: ApplicationEndocarditis}}>{children}</span>
    ),
  },
  {
    title: 'Additional information button',
    value: 'additionalButton',
    component: ({children}: BlockRenderProps) => (
      <span style={{color: PrimaryColor}}>{children}</span>
    ),
  },
  {
    title: 'Outline button',
    value: 'outlineButton',
    component: ({children}: BlockRenderProps) => (
      <span style={{color: PrimaryColor}}>{children}</span>
    ),
  },
  {
    title: 'References small',
    value: 'referencesSmall',
    component: ({children}: BlockRenderProps) => <span style={{fontSize: '1rem'}}>{children}</span>,
  },
  {
    title: 'Paragraph larger',
    value: 'paragraphLarger',
    component: ({children}: BlockRenderProps) => (
      <span style={{fontSize: '1.5rem'}}>{children}</span>
    ),
  },
  {
    title: 'Indented',
    value: 'indentText',
    component: ({children}: BlockRenderProps) => (
      <span style={{marginLeft: '20px'}}>{children}</span>
    ),
  },
]
