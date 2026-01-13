import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function Logo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a href='/' aria-label='Home' draggable='false'>
          <img src='/duck.svg' draggable='false' className='h-7 w-auto select-none' alt='Duck' />
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <div className='select-none'>Duky8n</div>
      </TooltipContent>
    </Tooltip>
  )
}
