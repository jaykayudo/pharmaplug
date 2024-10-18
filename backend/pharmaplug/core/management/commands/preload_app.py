import time
import os
import random
import json
from collections import Counter
from decimal import Decimal

from loguru import logger
from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction as db_transaction

from core import models

FIXTURE_PATH = settings.BASE_DIR / "fixtures"
MEDIA_PATH = FIXTURE_PATH / "media"
COUNTER = Counter()

class Command(BaseCommand):
    help = "Preload template data for pharmaplug"

    @db_transaction.atomic
    def handle(self, *args, **options):
        # load all categories
        logger.info("loading all doctors fields")
        self.load_categories()
        # load all sicknesses
        logger.info("loading all sicknesses")
        self.load_sicknesses()
        # load drugs
        logger.info("loading all drugs")
        self.load_drugs()
        #load blogs
        logger.info("loading all stories")
        self.load_blogs()
        # load doctors
        self.load_doctors()
        for key in COUNTER.keys():
            logger.info(f"number of {key} loaded: {COUNTER[key]}")

    def load_categories(self):
        categories_file = open(FIXTURE_PATH / "category.json","rb")
        data = json.load(categories_file)
        for item in data:
            image_path = self.randomize_file_in_dir(str(MEDIA_PATH / "categories"))
            image = open(image_path,"rb")
            models.DoctorCategory.objects.create(
                name = item["name"],
                description = item["description"],
                image = File(image, f'{item["name"]}_image.jpg')
            )
            COUNTER["categories"] += 1
    
    def load_sicknesses(self):
        sicknesses_file = open(FIXTURE_PATH / "symptoms.json","rb")
        data = json.load(sicknesses_file)
        for item in data:
            image_path = self.randomize_file_in_dir(str(MEDIA_PATH / "sicknesses"))
            image = open(image_path,"rb")
            models.Sickness.objects.create(
                name = item["name"],
                description = item["description"],
                image = File(image, f'{item["name"]}_image.jpg'),
                common = True if random.randint(1,3) == 2 else False
            )
            COUNTER["sicknesses"] += 1
    
    def load_blogs(self):
        blogs_file = open(FIXTURE_PATH / "blogs.json","rb")
        data = json.load(blogs_file)
        for item in data:
            image_path = self.randomize_file_in_dir(str(MEDIA_PATH / "blogs"))
            image = open(image_path,"rb")
            rand_num = random.randint(10000,90000)
            models.Story.objects.create(
                title = item["title"],
                content = item["content"],
                image = File(image,f"{rand_num}_image.pmg")
            )
            COUNTER["blogs"] += 1
        
    def load_doctors(self):
        all_categories = models.DoctorCategory.objects.all()
        print(all_categories)
        doctors_file = open(FIXTURE_PATH / "doctors.json","rb")
        data = json.load(doctors_file)
        for item in data:
            image_path = self.randomize_file_in_dir(str(MEDIA_PATH / "doctors"))
            image = open(image_path,"rb")
            random_field = random.choice(list(all_categories))
            user = models.User.objects.create(
                first_name = item["firstName"],
                last_name = item["lastName"],
                is_doctor = True,
                email = str(item["firstName"]+item["lastName"]+"@pharmaplug.com").lower(),
                phone_number = "0901234" + str(random.randint(1000, 9999)),
                username = item["firstName"]+"_"+item["lastName"]
            )
            user.set_password("Justdoit@22")
            user.save()
            models.Doctor.objects.create(
                user = user,
                field = random_field or None,
                rate = Decimal(random.randint(5000, 10000)),
                image = File(image, f'{item["firstName"]}{item["lastName"]}_image.png')
            )
            COUNTER["doctors"] += 1

    def load_drugs(self):
        all_sickness = models.Sickness.objects.all()
        print(all_sickness)
        drugs_file = open(FIXTURE_PATH / "drugs.json","rb")
        data = json.load(drugs_file)
        pharmacy = models.Pharmacy.objects.create(
            name="pharmaplug"
        )
        for item in data:
            sicknesses_list = [random.choice(all_sickness) for _ in range(3)]
            image_path = self.randomize_file_in_dir(str(MEDIA_PATH / "drugs"))
            image = open(image_path,"rb")
            drug = models.Product.objects.create(
                name=item["name"],
                price=Decimal(item["price"] * 1000),
                description = f"{item['form']} - {item['dosage']}",
                pharmacy = pharmacy,
                medication = "Take 1 daily",
                image = File(image,f"{item['name']}_image.png")
            )
            drug.sicknesses.set(sicknesses_list)
            COUNTER["drugs"] += 1

    def randomize_file_in_dir(self, directory: str):
        if not os.path.isdir(directory):
            raise Exception("Path must be directory")
        paths = os.listdir(directory)
        iter_counter = 0
        while True:
            path = random.choice(paths)
            if not os.path.isdir(os.path.join(directory,path)):
                break
            iter_counter += 1
            if iter_counter >= 10:
                raise Exception("Too many directory or no file in provided path")
        return os.path.join(directory, path)
