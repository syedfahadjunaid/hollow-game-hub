import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/8bit/avatar";

export default function HeaderProfile() {
  return (
    <Avatar className="size-10 shrink-0 transition-transform hover:scale-105 sm:size-12">
      <AvatarImage
        src="https://8bitcn.com/images/pixelized-8bitcnorc.jpg"
        alt="@8bitcn"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
