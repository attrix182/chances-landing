// components/ProfessionalCard.tsx
import Image from "next/image"

interface ProfessionalCardProps {
  professional: any
  isSelected?: boolean
  onClick?: () => void
}

export function ProfessionalCard({
  professional,
  isSelected = false,
  onClick,
}: ProfessionalCardProps) {
  if (!professional) return null

  const {
    firstName,
    lastName,
    image,
    dni,
    ranking,
    city,
    province,
    id,
  } = professional

  const returnFirstName = (name: string) =>
    name?.split(" ")[0] || name

  const cutLocationName = (city: string, province: string) =>
    `${city || ""}${city && province ? ", " : ""}${province || ""}`

  const removeTwoDecimals = (num: number) =>
    Number(num || 0).toFixed(1)

  return (
    <article
      className={`flex items-center w-[350px] max-h-[95px] bg-white rounded-lg px-4 py-2 shadow-md overflow-hidden cursor-pointer ${
        isSelected ? "" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden mb-3">
          <Image
            src={image ? image : "/assets/imgs/avatar.png"}
            alt="Avatar"
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute -bottom-0 -right-1 bg-black text-white rounded-full px-1 flex items-center text-sm mr-1">
        <div> ⭐️</div>
          <span className="text-xs font-semibold text-gray-700 text-white ml-2">
            {removeTwoDecimals(ranking)} 
          </span>
        </div>
      </div>

      <div className="ml-3 flex flex-col text-sm overflow-hidden">
        <div className="flex items-center gap-1 font-semibold text-base whitespace-nowrap">
          {returnFirstName(firstName)} {lastName}
          {dni && (
            <svg
              className="w-4 h-4 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="..." />
            </svg>
          )}
        </div>
        <div className="text-xs text-gray-600 truncate">
          {cutLocationName(city, province)}
        </div>
      </div>
    </article>
  )
}
