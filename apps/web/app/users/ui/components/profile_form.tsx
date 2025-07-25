import React, { useRef, useState } from 'react'
import { useForm } from '@inertiajs/react'

import { UserAvatar } from '#common/ui/components/user_avatar'
import { useTranslation } from '#common/ui/hooks/use_translation'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Progress } from '@workspace/ui/components/progress'
import { toast } from '@workspace/ui/hooks/use-toast'

import type UserDto from '#users/dtos/user'

interface Props {
  user: UserDto
}

export function ProfileForm({ user }: Props) {
  const { t } = useTranslation()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { data, setData, errors, put, progress } = useForm({
    fullName: user.fullName ?? '',
    avatar: null as File | null,
  })

  const avatarInputRef = useRef<HTMLInputElement>(null)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setData('avatar', file)
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(null)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    put('/settings/profile', {
      preserveScroll: true,
      onSuccess: () => {
        setPreviewUrl(null)

        toast(t('users.action.toast.type_success'), {
          description: t('users.action.toast.settings_updated', {setting: t('users.layout.profile')}),
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-0.5" encType="multipart/form-data">
      <div className="col-span-full flex items-center gap-x-8">
        <UserAvatar
          user={{ ...user, avatarUrl: previewUrl ?? user.avatarUrl }}
          className="size-24 flex-none rounded-lg object-cover"
        />

        <div>
          <Button type="button" onClick={() => avatarInputRef.current?.click()}>
            {t('users.action.actions.change_avatar')}
          </Button>
          <p className="mt-2 text-xs/5">JPG, GIF or PNG. 1MB max.</p>
        </div>
      </div>

      <Input
        ref={avatarInputRef}
        id="avatar"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleAvatarChange}
      />

      {errors?.avatar && (
        <p className="text-[0.8rem] font-medium text-destructive">{errors.avatar}</p>
      )}

      <div>
        <Label htmlFor="fullName" className="mb-1 text-gray-700">
          {t('users.action.form.full_name.label')}
        </Label>
        <Input
          id="fullName"
          placeholder={t('users.action.form.full_name.placeholder')}
          value={data.fullName}
          onChange={(e) => setData('fullName', e.target.value)}
          className={errors?.fullName ? 'border-red-500' : ''}
        />
        {errors?.fullName && (
          <p className="text-[0.8rem] font-medium text-destructive">{errors.fullName}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="mb-1 text-gray-700">
          {t('users.action.form.email.label')}
        </Label>
        <p>{user.email}</p>
      </div>

      {progress && (
        <Progress
          value={progress.percentage}
          max={100}
          className="w-full h-2 bg-gray-200 rounded mt-2"
        />
      )}

      <div className="pt-2">
        <Button type="submit">{t('users.action.actions.save')}</Button>
      </div>
    </form>
  )
}
